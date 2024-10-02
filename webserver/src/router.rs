use axum::{
  routing::{get, post},
  Router,
};
use tower_http::cors::CorsLayer;

use crate::authenticate;

pub(crate) fn create_router(state: crate::AppState) -> Router {
  let authenticate_router = Router::new()
    .route("/login", post(authenticate::account_login))
    .route("/register", post(authenticate::account_register));

  Router::new()
    .route("/", get(index))
    .nest("/", authenticate_router)
    .with_state(state)
    .layer(CorsLayer::permissive())
}

async fn index() -> &'static str {
  "Hello, World!"
}
