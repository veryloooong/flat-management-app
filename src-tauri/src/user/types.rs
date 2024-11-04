use super::UserRole;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct LoginResponse {
  pub access_token: String,
  pub refresh_token: String,
  pub expires_in: i64,
  pub token_type: String,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct RegisterInfo {
  name: String,
  username: String,
  email: String,
  phone: String,
  password: String,
  role: UserRole,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct BasicAccountInfo {
  pub id: i32,
  pub name: String,
  pub username: String,
  pub email: String,
  pub phone: String,
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

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AccountRecoveryMethod {
  Email,
  Phone,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct AccountRecoveryInfo {
  pub username: String,
  pub method: AccountRecoveryMethod,
  pub email: Option<String>,
  pub phone: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct UpdateUserInfo {
  pub name: String,
  pub username: String,
  pub email: String,
  pub phone: String,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct UpdatePasswordInfo {
  pub old_password: String,
  pub new_password: String,
}
