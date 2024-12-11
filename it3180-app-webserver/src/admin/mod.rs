use crate::{entities::users, prelude::*};

use axum_extra::extract::Query;
use sea_orm::{Order, QueryOrder};
use tags::ADMIN;

/// Get the list of all users.
#[utoipa::path(
  get,
  path = "/users",
  description = "Lấy danh sách tất cả người dùng, yêu cầu request có role là Admin. Trả về danh sách người dùng.",
  tag = ADMIN,
  responses(
    (status = OK, description = "List of users", body = Vec<BasicUserInfo>),
    (status = BAD_REQUEST, description = "Invalid request", body = String),
    (status = UNAUTHORIZED, description = "Invalid token"),
    (status = FORBIDDEN, description = "Forbidden"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_all_users(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let jwt_access_secret = &state.jwt_access_secret;

  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err((StatusCode::UNAUTHORIZED, HeaderMap::new(), "".to_string()));
    }
  };

  let user_role = claims.custom.role;

  if user_role != UserRole::Admin {
    return Err((StatusCode::FORBIDDEN, HeaderMap::new(), "".to_string()));
  }

  let users = match Users::find()
    .order_by(users::Column::Id, Order::Asc)
    .into_partial_model::<BasicUserInfo>()
    .all(&state.db)
    .await
  {
    Ok(users) => users,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "".to_string(),
      ));
    }
  };

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&users).unwrap(),
  ))
}

/// Check if the user is an admin.
#[utoipa::path(
  get,
  path = "/check",
  description = "Kiểm tra người dùng có role là Admin hay không. Trả về status OK nếu thành công.",
  tag = ADMIN,
  responses(
    (status = OK, description = "Admin check successful"),
    (status = UNAUTHORIZED, description = "Invalid token"),
    (status = FORBIDDEN, description = "Forbidden"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn check_admin(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> StatusCode {
  let jwt_access_secret = &state.jwt_access_secret;

  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return StatusCode::UNAUTHORIZED;
    }
  };

  let user_role = claims.custom.role;

  if user_role != UserRole::Admin {
    return StatusCode::FORBIDDEN;
  }

  StatusCode::OK
}

#[derive(Debug, Deserialize, utoipa::IntoParams)]
pub struct ActivateUserParams {
  user_id: i32,
  status: String,
}

#[utoipa::path(
  post,
  path = "/activate",
  description = "Kích hoạt người dùng. Yêu cầu request có role là Admin.",
  params(
    ActivateUserParams
  ),
  tag = ADMIN,
  responses(
    (status = OK, description = "User activated"),
    (status = BAD_REQUEST, description = "Invalid request"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn activate_user(
  State(state): State<AppState>,
  Query(ActivateUserParams { user_id, status }): Query<ActivateUserParams>,
) -> StatusCode {
  let user = match Users::find_by_id(user_id).one(&state.db).await {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return StatusCode::INTERNAL_SERVER_ERROR;
    }
  };

  if user.is_none() {
    return StatusCode::BAD_REQUEST;
  }

  let status = match status.as_str() {
    "active" => UserStatus::Active,
    "inactive" => UserStatus::Inactive,
    _ => return StatusCode::BAD_REQUEST,
  };

  let user = user.unwrap();
  if user.role == UserRole::Admin {
    return StatusCode::BAD_REQUEST;
  }

  let mut user: users::ActiveModel = user.into();

  user.status = Set(status);

  match user.update(&state.db).await {
    Ok(_) => (),
    Err(e) => {
      log::error!("Error: {:?}", e);
      return StatusCode::INTERNAL_SERVER_ERROR;
    }
  }

  StatusCode::OK
}
