//! `SeaORM` Entity, @generated by sea-orm-codegen 1.0.1

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
  Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize, utoipa :: ToSchema,
)]
#[sea_orm(table_name = "fees_room_assignment")]
pub struct Model {
  #[sea_orm(primary_key)]
  pub assignment_id: i32,
  pub room_number: i32,
  pub fee_id: i32,
  pub due_date: DateTime,
  pub payment_date: Option<DateTime>,
  pub is_paid: bool,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
  #[sea_orm(
    belongs_to = "super::fees::Entity",
    from = "Column::FeeId",
    to = "super::fees::Column::Id",
    on_update = "NoAction",
    on_delete = "Cascade"
  )]
  Fees,
  #[sea_orm(
    belongs_to = "super::rooms::Entity",
    from = "Column::RoomNumber",
    to = "super::rooms::Column::RoomNumber",
    on_update = "NoAction",
    on_delete = "SetDefault"
  )]
  Rooms,
  #[sea_orm(has_many = "super::transactions::Entity")]
  Transactions,
}

impl Related<super::fees::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::Fees.def()
  }
}

impl Related<super::rooms::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::Rooms.def()
  }
}

impl Related<super::transactions::Entity> for Entity {
  fn to() -> RelationDef {
    Relation::Transactions.def()
  }
}

impl ActiveModelBehavior for ActiveModel {}
