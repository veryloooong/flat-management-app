//! `SeaORM` Entity, @generated by sea-orm-codegen 1.0.1

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
  Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize, utoipa :: ToSchema,
)]
#[sea_orm(table_name = "fee_recurrence")]
pub struct Model {
  #[sea_orm(primary_key)]
  pub recurrence_id: i32,
  #[sea_orm(unique)]
  pub fee_id: i32,
  pub previous_fee_id: i32,
  pub due_date: DateTime,
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
  Fees2,
  #[sea_orm(
    belongs_to = "super::fees::Entity",
    from = "Column::PreviousFeeId",
    to = "super::fees::Column::Id",
    on_update = "NoAction",
    on_delete = "Cascade"
  )]
  Fees1,
}

impl ActiveModelBehavior for ActiveModel {}