use utoipa::openapi::schema;

use crate::prelude::*;

#[derive(serde::Serialize, serde::Deserialize, Debug, ToSchema)]
#[serde(rename_all = "snake_case")]
pub struct LoginInfo {
  pub username: String,
  pub password: String,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "snake_case")]
pub struct AccessTokenError {
  pub error: String,
  pub error_description: String,
}

#[derive(serde::Serialize, serde::Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub struct TokenResponse {
  pub access_token: String,
  pub refresh_token: String,
  pub expires_in: i64,
  pub token_type: String,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub struct RegisterInfo {
  pub username: String,
  pub email: String,
  pub phone: String,
  pub password: String,
  #[schema(value_type = String, examples("manager", "tenant"))]
  pub role: UserRole,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub(crate) struct AccessTokenClaims {
  pub username: String,
  pub id: i32,
  pub role: UserRole,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub(crate) struct RefreshTokenClaims {
  pub username: String,
  pub id: i32,
  pub role: UserRole,
  pub refresh_token_version: i32,
}
