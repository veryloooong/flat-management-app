//! `SeaORM` Entity, @generated by sea-orm-codegen 1.0.1

use super::sea_orm_active_enums::RecurrenceType;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
  Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize, utoipa :: ToSchema,
)]
#[sea_orm(table_name = "fees")]
pub struct Model {
  #[sea_orm(primary_key)]
  pub id: i32,
  pub name: String,
  pub amount: i64,
  pub is_required: bool,
  pub created_at: DateTime,
  pub is_recurring: bool,
  pub due_date: DateTime,
  pub recurrence_type: Option<RecurrenceType>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
  #[sea_orm(has_many = "super::fees_room_assignment::Entity")]
  FeesRoomAssignment,
}

impl Related<super::fees_room_assignment::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::FeesRoomAssignment.def()
  }
}

impl ActiveModelBehavior for ActiveModel {}
