use sea_orm_migration::{prelude::*, schema::*};

use crate::m20240101_000005_create_fees_room_table::FeesRoomAssignment;

#[derive(DeriveIden)]
pub enum Transactions {
  Table,
  Id,
  Amount,
  CreatedAt,
  AssignmentId,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Transactions::Table)
          .if_not_exists()
          .col(
            integer(Transactions::Id)
              .not_null()
              .auto_increment()
              .primary_key(),
          )
          .col(big_integer(Transactions::Amount).not_null())
          .col(
            timestamp(Transactions::CreatedAt)
              .not_null()
              .default(Expr::current_timestamp()),
          )
          .col(integer(Transactions::AssignmentId).not_null())
          .foreign_key(
            ForeignKey::create()
              .name("fk_transactions_assignment_id")
              .from(Transactions::Table, Transactions::AssignmentId)
              .to(FeesRoomAssignment::Table, FeesRoomAssignment::AssignmentId)
              .on_delete(ForeignKeyAction::Cascade),
          )
          .to_owned(),
      )
      .await?;

    Ok(())
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(
        Table::drop()
          .if_exists()
          .table(Transactions::Table)
          .to_owned(),
      )
      .await?;

    Ok(())
  }
}
