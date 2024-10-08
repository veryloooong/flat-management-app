use crate::entities::prelude::*;
use crate::entities::sea_orm_active_enums::*;

use sea_orm::{prelude::*, FromQueryResult};

#[derive(serde::Serialize, serde::Deserialize, FromQueryResult, DerivePartialModel)]
#[sea_orm(entity = "Users")]
pub struct BasicUserInfo {
  pub id: i32,
  pub username: String,
  pub email: String,
  pub phone: String,
  pub role: UserRole,
}
