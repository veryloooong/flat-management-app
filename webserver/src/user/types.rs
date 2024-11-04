use crate::prelude::*;

use sea_orm::FromQueryResult;

#[derive(serde::Serialize, serde::Deserialize, FromQueryResult, DerivePartialModel, ToSchema)]
#[sea_orm(entity = "Users")]
pub struct BasicUserInfo {
  pub id: i32,
  pub name: String,
  pub username: String,
  pub email: String,
  pub phone: String,
  #[schema(value_type = String, examples("manager", "tenant"))]
  pub role: UserRole,
}

#[derive(serde::Serialize, serde::Deserialize, FromQueryResult, DerivePartialModel, ToSchema)]
#[sea_orm(entity = "Users")]
pub struct UpdateUserInfo {
  pub name: String,
  pub username: String,
  pub email: String,
  pub phone: String,
}

#[derive(serde::Serialize, serde::Deserialize, ToSchema)]
pub struct UpdatePasswordInfo {
  pub old_password: String,
  pub new_password: String,
}
