pub mod types;

use crate::prelude::*;

use crate::entities::users;

use tags::USER;

/// Gets the user info from the database. Takes a bearer token and returns the user info.
#[utoipa::path(
  get,
  path = "/info",
  tag = USER,
  responses(
    (status = OK, description = "User info", body = BasicUserInfo),
    (status = BAD_REQUEST, description = "Invalid request", body = String),
    (status = NOT_FOUND, description = "User not found", body = String),
    (status = UNAUTHORIZED, description = "Invalid token", body = String),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub(crate) async fn get_user_info(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let jwt_access_secret = &state.jwt_access_secret;

  // use bearer token to get user info
  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err((
        StatusCode::UNAUTHORIZED,
        HeaderMap::new(),
        "invalid token".to_string(),
      ));
    }
  };

  let user_id = claims.custom.id;

  let user = match Users::find()
    .filter(users::Column::Id.eq(user_id))
    .into_partial_model::<BasicUserInfo>()
    .one(&state.db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "server error".to_string(),
      ));
    }
  };

  let user = match user {
    Some(user) => user,
    None => {
      return Err((
        StatusCode::NOT_FOUND,
        HeaderMap::new(),
        "user not found".to_string(),
      ));
    }
  };

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&user).unwrap(),
  ))
}

pub async fn update_user_info(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let jwt_access_secret = &state.jwt_access_secret;
  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err((
        StatusCode::UNAUTHORIZED,
        HeaderMap::new(),
        "invalid token".to_string(),
      ));
    }
  };

  let user_id = claims.custom.id;

  let user = match Users::find()
    .filter(users::Column::Id.eq(user_id))
    .one(&state.db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "server error".to_string(),
      ));
    }
  };

  let user = match user {
    Some(user) => user,
    None => {
      return Err((
        StatusCode::NOT_FOUND,
        HeaderMap::new(),
        "user not found".to_string(),
      ));
    }
  };

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&user).unwrap(),
  ))
}
