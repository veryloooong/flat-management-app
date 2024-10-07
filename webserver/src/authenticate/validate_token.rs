use axum::extract::{Request, State};
use axum::middleware::Next;
use axum::response::IntoResponse;
use axum_extra::headers::authorization::{Authorization, Bearer};
use axum_extra::TypedHeader;

use crate::AppState;

pub async fn validate_request(
  State(state): State<AppState>,
  mut req: Request,
  next: Next,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let jwt_access_secret = &state.jwt_access_secret;

  if fastrand::bool() {
    return Err("Unauthorized");
  } else {
    return Ok(next.run(req).await);
  }
}
