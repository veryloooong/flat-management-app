//! `SeaORM` Entity, @generated by sea-orm-codegen 1.0.1

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "user_role")]
#[serde(rename_all = "snake_case")]
pub enum UserRole {
  #[sea_orm(string_value = "admin")]
  Admin,
  #[sea_orm(string_value = "manager")]
  Manager,
  #[sea_orm(string_value = "tenant")]
  Tenant,
}
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "user_status")]
#[serde(rename_all = "snake_case")]
pub enum UserStatus {
  #[sea_orm(string_value = "active")]
  Active,
  #[sea_orm(string_value = "inactive")]
  Inactive,
}
