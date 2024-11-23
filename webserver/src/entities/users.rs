//! `SeaORM` Entity, @generated by sea-orm-codegen 1.0.1

use super::sea_orm_active_enums::UserRole;
use super::sea_orm_active_enums::UserStatus;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
  Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize, utoipa :: ToSchema,
)]
#[sea_orm(table_name = "users")]
pub struct Model {
  #[sea_orm(primary_key)]
  pub id: i32,
  pub name: String,
  #[sea_orm(unique)]
  pub username: String,
  #[sea_orm(unique)]
  pub email: String,
  #[sea_orm(column_type = "VarBinary(StringLen::None)")]
  pub salt: Vec<u8>,
  #[sea_orm(column_type = "VarBinary(StringLen::None)")]
  pub password: Vec<u8>,
  pub phone: String,
  pub role: UserRole,
  pub status: UserStatus,
  pub refresh_token_version: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
  #[sea_orm(has_one = "super::rooms::Entity")]
  Rooms,
}

impl Related<super::rooms::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::Rooms.def()
  }
}

impl ActiveModelBehavior for ActiveModel {}
