//! `SeaORM` Entity, @generated by sea-orm-codegen 1.0.1

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "transactions")]
pub struct Model {
  #[sea_orm(primary_key)]
  pub id: i32,
  pub amount: i64,
  pub created_at: DateTime,
  pub room_number: i32,
  pub fee_id: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
  #[sea_orm(
    belongs_to = "super::fees::Entity",
    from = "Column::FeeId",
    to = "super::fees::Column::Id",
    on_update = "NoAction",
    on_delete = "NoAction"
  )]
  Fees,
  #[sea_orm(
    belongs_to = "super::rooms::Entity",
    from = "Column::RoomNumber",
    to = "super::rooms::Column::RoomNumber",
    on_update = "NoAction",
    on_delete = "NoAction"
  )]
  Rooms,
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

impl ActiveModelBehavior for ActiveModel {}