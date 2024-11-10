use crate::prelude::*;

use serde_json::json;

use tags::AUTH;

pub async fn validate_request(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
  req: Request,
  next: Next,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let jwt_access_secret = &state.jwt_access_secret;

  let expired_token_error = AccessTokenError {
    error: "expired_token".to_string(),
    error_description: "expired token".to_string(),
  };

  let invalid_token_error = AccessTokenError {
    error: "invalid_token".to_string(),
    error_description: "invalid token".to_string(),
  };

  let mut response_headers = HeaderMap::new();
  response_headers.append(
    header::WWW_AUTHENTICATE,
    serde_json::to_string(&expired_token_error)
      .unwrap()
      .parse()
      .unwrap(),
  );
  response_headers.append(header::CONTENT_TYPE, "application/json".parse().unwrap());

  let token = bearer.token();

  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(token, None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err((
        StatusCode::UNAUTHORIZED,
        response_headers,
        json!(invalid_token_error).to_string(),
      ))
    }
  };

  let expires_at = claims.expires_at.unwrap().as_secs();
  let now = chrono::Utc::now().timestamp() as u64;

  if now > expires_at {
    return Err((
      StatusCode::UNAUTHORIZED,
      response_headers,
      json!(expired_token_error).to_string(),
    ));
  }

  return Ok(next.run(req).await);
}

/// Check if the token is valid.
#[utoipa::path(
  get,
  path = "/check",
  summary = "Check if the token is valid",
  tag = tags::MISC,
  responses(
    (status = OK, description = "Token is valid"),
    (status = UNAUTHORIZED, description = "Invalid token", body = AccessTokenError),
  ),
  security(
    ("Authorization" = [])
  )
)]
#[allow(unused_variables)]
pub async fn check_token(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> StatusCode {
  StatusCode::OK
}

/// Grant a new access token by providing a refresh token.
#[utoipa::path(
  post,
  path = "/refresh",
  summary = "Grant a new access token by providing a refresh token",
  tag = AUTH,
  responses(
    (status = OK, description = "New access token granted", body = TokenResponse),
    (status = UNAUTHORIZED, description = "Invalid token", body = AccessTokenError),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
  )
)]
pub async fn grant_new_access_token(
  State(state): State<AppState>,
  Json(req): Json<RefreshTokenRequest>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let db = &state.db;
  let jwt_access_secret = &state.jwt_access_secret;
  let jwt_refresh_secret = &state.jwt_refresh_secret;

  let invalid_token_error = AccessTokenError {
    error: "invalid_token".to_string(),
    error_description: "invalid token".to_string(),
  };
  let server_error = (
    StatusCode::INTERNAL_SERVER_ERROR,
    HeaderMap::new(),
    "server error".to_string(),
  );

  let mut headers = HeaderMap::new();
  headers.append(header::CONTENT_TYPE, "application/json".parse().unwrap());

  let claims = match jwt_refresh_secret.verify_token::<RefreshTokenClaims>(&req.refresh_token, None)
  {
    Ok(claims) => claims,
    Err(_) => {
      return Err((
        StatusCode::UNAUTHORIZED,
        headers,
        json!(invalid_token_error).to_string(),
      ));
    }
  };

  let user_id = claims.custom.id;
  let refresh_token_version = claims.custom.refresh_token_version;

  let user = match Users::find_by_id(user_id).one(db).await {
    Ok(user) => user,
    Err(_) => {
      return Err((
        StatusCode::UNAUTHORIZED,
        headers,
        json!(invalid_token_error).to_string(),
      ));
    }
  };

  let user = match user {
    Some(user) => user,
    None => {
      return Err((
        StatusCode::UNAUTHORIZED,
        headers,
        json!(invalid_token_error).to_string(),
      ));
    }
  };

  if user.refresh_token_version != refresh_token_version {
    return Err((
      StatusCode::UNAUTHORIZED,
      headers,
      json!(invalid_token_error).to_string(),
    ));
  }

  let access_token_expiry = Duration::from_mins(15);

  let access_token_claims = AccessTokenClaims {
    username: user.username,
    id: user.id,
    role: user.role,
  };
  let claims = Claims::with_custom_claims(access_token_claims, access_token_expiry);
  let access_token = jwt_access_secret.authenticate(claims).map_err(|e| {
    log::error!("Error creating access token: {:?}", e);
    server_error
  })?;

  let response = TokenResponse {
    access_token,
    refresh_token: req.refresh_token,
    expires_in: access_token_expiry.as_secs() as i64,
    token_type: "Bearer".to_string(),
  };

  headers.append(header::CACHE_CONTROL, "no-store".parse().unwrap());

  Ok((StatusCode::OK, headers, json!(response).to_string()))
}
