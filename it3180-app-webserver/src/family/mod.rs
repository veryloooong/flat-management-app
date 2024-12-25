use crate::{entities::family, prelude::*};

#[derive(Debug, Clone, serde::Deserialize, serde::Serialize, ToSchema)]
pub struct AddFamilyMemberInfo {
  pub name: String,
  pub birthday: chrono::NaiveDate,
}

/// Thêm thông tin của một thành viên gia đình
#[utoipa::path(
  post,
  path = "/family",
  description = "Thêm thông tin của một thành viên gia đình",
  tag = tags::FAMILY,
  responses(
    (status = OK, description = "OK"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = FORBIDDEN, description = "Forbidden"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn add_family_member(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
  Json(member_info): Json<AddFamilyMemberInfo>,
) -> StatusCode {
  let user_info = match state
    .jwt_access_secret
    .verify_token::<AccessTokenClaims>(&bearer.token(), None)
  {
    Ok(user_info) => user_info,
    Err(_) => return StatusCode::UNAUTHORIZED,
  };

  let family_member = family::ActiveModel {
    name: Set(member_info.name),
    birthday: Set(member_info.birthday),
    account_id: Set(user_info.custom.id),
    ..Default::default()
  };

  match family::Entity::insert(family_member).exec(&state.db).await {
    Ok(_) => StatusCode::CREATED,
    Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
  }
}

#[utoipa::path(
  get,
  path = "/family",
  description = "Lấy thông tin của tất cả thành viên gia đình",
  tag = tags::FAMILY,
  responses(
    (status = OK, description = "OK", body = Vec<family::Model>),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = NOT_FOUND, description = "Not found"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = FORBIDDEN, description = "Forbidden"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_family_members(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<Json<Vec<family::Model>>, StatusCode> {
  let user_info = state
    .jwt_access_secret
    .verify_token::<AccessTokenClaims>(&bearer.token(), None)
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

  let family_members = family::Entity::find()
    .filter(family::Column::AccountId.eq(user_info.custom.id))
    .all(&state.db)
    .await;

  match family_members {
    Ok(family_members) => Ok(Json(family_members)),
    Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
  }
}
