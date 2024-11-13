use axum::{middleware, Router};
use tower_http::cors::CorsLayer;
use utoipa::{
  openapi::security::{ApiKey, ApiKeyValue, SecurityScheme},
  OpenApi,
};
use utoipa_axum::{router::OpenApiRouter, routes};
use utoipa_swagger_ui::SwaggerUi;

use crate::{
  admin,
  authenticate::{self, validate_token::*},
  user,
};

pub mod tags {
  pub const AUTH: &str = "Authentication";
  pub const USER: &str = "User";
  pub const MISC: &str = "Miscellaneous";
  pub const ADMIN: &str = "Admin";
  pub const MANAGER: &str = "Manager";
}

pub(crate) fn create_router(state: crate::AppState) -> Router {
  #[derive(OpenApi)]
  #[openapi(
    modifiers(&SecurityAddon),
    tags(
      (name = tags::AUTH, description = "Authentication related endpoints"),
      (name = tags::MANAGER, description = "Management related endpoints"),
      (name = tags::USER, description = "User related endpoints"),
      (name = tags::ADMIN, description = "Admin only endpoints"),
      (name = tags::MISC, description = "Other endpoints"),
    )
  )]
  struct ApiDoc;

  struct SecurityAddon;

  impl utoipa::Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
      if let Some(components) = openapi.components.as_mut() {
        components.add_security_scheme(
          "Authorization",
          SecurityScheme::ApiKey(ApiKey::Header(ApiKeyValue::new("Authorization"))),
        );
      }
    }
  }

  let authenticate_router = OpenApiRouter::new()
    .routes(routes!(authenticate::account_login))
    .routes(routes!(authenticate::account_register))
    .routes(routes!(authenticate::recover_password::recover_password))
    .routes(routes!(grant_new_access_token))
    .routes(routes!(authenticate::account_logout));

  let user_router = OpenApiRouter::new()
    .routes(routes!(user::get_user_info, user::update_user_info))
    .routes(routes!(user::update_password))
    .routes(routes!(check_token))
    .layer(middleware::from_fn_with_state(
      state.clone(),
      crate::middleware::validate_request,
    ));

  let admin_router = OpenApiRouter::new()
    .routes(routes!(admin::get_all_users))
    .routes(routes!(admin::check_admin))
    .layer(middleware::from_fn_with_state(
      state.clone(),
      crate::middleware::admin_middleware,
    ))
    .layer(middleware::from_fn_with_state(
      state.clone(),
      crate::middleware::validate_request,
    ));

  let manager_router = OpenApiRouter::new()
    .routes(routes!(
      crate::manager::get_fees,
      crate::manager::add_fee,
      crate::manager::remove_fee
    ))
    .layer(middleware::from_fn_with_state(
      state.clone(),
      crate::middleware::manager_middleware,
    ))
    .layer(middleware::from_fn_with_state(
      state.clone(),
      crate::middleware::validate_request,
    ));

  let (auth_router, api) = OpenApiRouter::with_openapi(ApiDoc::openapi())
    .routes(routes!(health_check))
    .nest("/auth", authenticate_router)
    .nest("/user", user_router)
    .nest("/admin", admin_router)
    .nest("/manager", manager_router)
    .split_for_parts();

  Router::new()
    .merge(auth_router)
    .merge(SwaggerUi::new("/api").url("/api-docs/openapi.json", api))
    .with_state(state)
    .layer(CorsLayer::permissive())
}

#[utoipa::path(get, path = "/health", tag = tags::MISC, summary = "Health check", responses(
  (status = OK, description = "OK", body = String, example = "OK"),
  (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String, example = "Server error"),
))]
async fn health_check() -> &'static str {
  "OK"
}
