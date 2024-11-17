use sea_orm::FromQueryResult;

use crate::prelude::*;

/// Represents username / password for login
#[derive(serde::Serialize, serde::Deserialize, Debug, ToSchema)]
#[serde(rename_all = "snake_case")]
pub struct LoginInfo {
  pub username: String,
  pub password: String,
}

/// Represents an error response for access token
#[derive(serde::Serialize, serde::Deserialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "snake_case")]
pub struct AccessTokenError {
  #[schema(examples("invalid_token"))]
  pub error: String,
  #[schema(examples("expired token"))]
  pub error_description: String,
}

/// Represents a successful token response with access token, refresh token, and expiry
#[derive(serde::Serialize, serde::Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub struct TokenResponse {
  pub access_token: String,
  pub refresh_token: String,
  #[schema(examples(300))]
  pub expires_in: i64,
  #[schema(examples("Bearer"))]
  pub token_type: String,
}

/// Represents user registration information
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub struct RegisterInfo {
  pub name: String,
  pub username: String,
  pub email: String,
  pub phone: String,
  pub password: String,
  #[schema(value_type = String, examples("manager", "tenant"))]
  pub role: UserRole,
}

/// Represents an access token refresh request
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, ToSchema)]
pub struct RefreshTokenRequest {
  pub refresh_token: String,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub(crate) struct AccessTokenClaims {
  pub username: String,
  pub id: i32,
  pub role: UserRole,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize, ToSchema)]
pub enum RecoverPasswordMethod {
  #[serde(rename = "email")]
  Email,
  #[serde(rename = "phone")]
  Phone,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub(crate) struct RecoverPasswordInfo {
  #[schema(value_type = String, examples("email", "phone"))]
  pub method: RecoverPasswordMethod,
  pub email: Option<String>,
  pub phone: Option<String>,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub(crate) struct RefreshTokenClaims {
  pub username: String,
  pub id: i32,
  pub role: UserRole,
  pub refresh_token_version: i32,
}

#[derive(
  Debug, Clone, serde::Serialize, serde::Deserialize, ToSchema, DerivePartialModel, FromQueryResult,
)]
#[serde(rename_all = "snake_case")]
#[sea_orm(entity = "Fees")]
pub struct FeesInfo {
  pub id: i32,
  pub name: String,
  pub amount: i64,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, ToSchema)]
pub struct AddFeeInfo {
  pub name: String,
  pub amount: i64,
}
