use axum::{
  middleware,
  routing::{get, post},
  Router,
};
use tower_http::cors::CorsLayer;
use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};
use utoipa_swagger_ui::SwaggerUi;

use crate::{
  authenticate::{self, validate_token::*},
  user,
};

pub(crate) fn create_router(state: crate::AppState) -> Router {
  #[derive(OpenApi)]
  #[openapi(tags(
    (name = "auth")
  ))]
  struct ApiDoc;

  let authenticate_router = OpenApiRouter::new()
    .routes(routes!(authenticate::account_login))
    .routes(routes!(authenticate::account_register))
    .routes(routes!(grant_new_access_token))
    .routes(routes!(authenticate::account_logout));

  let (auth_router, api) = OpenApiRouter::with_openapi(ApiDoc::openapi())
    .nest("/auth", authenticate_router)
    .split_for_parts();

  let user_router = Router::new()
    .route(
      "/info",
      get(user::get_user_info).patch(user::update_user_info),
    )
    .layer(middleware::from_fn_with_state(
      state.clone(),
      validate_request,
    ));

  Router::new()
    .route("/", get(index))
    // .nest("/auth", authenticate_router)
    .merge(auth_router)
    .nest("/user", user_router)
    .merge(SwaggerUi::new("/api").url("/api-docs/openapi.json", api))
    .with_state(state)
    .layer(CorsLayer::permissive())
}

async fn index() -> &'static str {
  "Hello, World!"
}
