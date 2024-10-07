use axum::{
  middleware,
  routing::{get, post},
  Router,
};
use tower_http::cors::CorsLayer;

use crate::{
  authenticate::{self, validate_token::validate_request},
  user,
};

pub(crate) fn create_router(state: crate::AppState) -> Router {
  let authenticate_router = Router::new()
    .route("/login", post(authenticate::account_login))
    .route("/register", post(authenticate::account_register))
    .route("/logout", post(authenticate::account_logout));

  let user_router = Router::new()
    .route("/{user_id}", get(user::get_user_info))
    .layer(middleware::from_fn_with_state(
      state.clone(),
      validate_request,
    ));

  Router::new()
    .route("/", get(index))
    .nest("/auth", authenticate_router)
    .with_state(state)
    .layer(CorsLayer::permissive())
}

async fn index() -> &'static str {
  "Hello, World!"
}
