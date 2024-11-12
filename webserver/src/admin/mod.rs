use crate::prelude::*;

use tags::ADMIN;

/// Get the list of all users.
#[utoipa::path(
  get,
  path = "/users",
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
