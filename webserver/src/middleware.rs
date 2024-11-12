use crate::prelude::*;

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
