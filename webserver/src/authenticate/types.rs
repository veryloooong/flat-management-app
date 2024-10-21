use crate::entities::sea_orm_active_enums::*;

#[derive(serde::Serialize, serde::Deserialize, Debug)]
#[serde(rename_all = "snake_case")]
pub struct LoginInfo {
  pub username: String,
  pub password: String,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
#[serde(rename_all = "snake_case")]
pub struct AccessTokenError {
  pub error: String,
  pub error_description: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct TokenResponse {
  pub access_token: String,
  pub refresh_token: String,
  pub expires_in: i64,
  pub token_type: String,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RegisterInfo {
  pub username: String,
  pub email: String,
  pub phone: String,
  pub password: String,
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
