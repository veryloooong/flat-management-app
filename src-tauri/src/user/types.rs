use super::UserRole;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct LoginResponse {
  pub access_token: String,
  pub refresh_token: String,
  pub expires_in: i64,
  pub token_type: String,
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
