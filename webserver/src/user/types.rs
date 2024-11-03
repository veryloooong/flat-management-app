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
