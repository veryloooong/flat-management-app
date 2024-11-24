use crate::{
  entities::{rooms, users},
  prelude::*,
};

pub mod types {
  use sea_orm::FromQueryResult;

  use super::*;

  #[derive(Debug, Serialize, Deserialize, DerivePartialModel, FromQueryResult)]
  #[sea_orm(entity = "Rooms")]
  pub struct RoomInfo {
    pub room_number: i32,
    pub tenant_id: i32,
  }
}

#[utoipa::path(
  get,
  path = "/household",
  tag = tags::HOUSEHOLD,
  responses(
    (status = OK, description = "Household info"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = NOT_FOUND, description = "User not found"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_household_info(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<impl IntoResponse, StatusCode> {
  let jwt_access_secret = &state.jwt_access_secret;

  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err(StatusCode::UNAUTHORIZED);
    }
  };

  let user_id = claims.custom.id;

  // get user info
  let user = match Users::find()
    .filter(users::Column::Id.eq(user_id))
    .into_partial_model::<BasicUserInfo>()
    .one(&state.db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  let user = match user {
    Some(user) => user,
    None => {
      log::error!("User not found");
      return Err(StatusCode::NOT_FOUND);
    }
  };

  // get room info where user is a tenant
  let room = match Rooms::find()
    .filter(rooms::Column::TenantId.eq(user_id))
    .one(&state.db)
    .await
  {
    Ok(room) => room,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  let room = match room {
    Some(room) => room,
    None => {
      log::error!("Room not found");
      return Err(StatusCode::NOT_FOUND);
    }
  };

  // return user and room info as one json object
  let mut household_info = json!(user);
  household_info["room_number"] = json!(room.room_number);

  Ok(household_info.to_string())
}
