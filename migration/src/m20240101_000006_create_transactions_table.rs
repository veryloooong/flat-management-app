use sea_orm_migration::{prelude::*, schema::*};

use crate::m20240101_000001_create_fees_table::Fees;
use crate::m20240101_000003_create_rooms_table::Rooms;

#[derive(DeriveIden)]
pub enum Transactions {
  Table,
  Id,
  Amount,
  CreatedAt,
  RoomNumber,
  FeeId,
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
          .col(integer(Transactions::RoomNumber).not_null())
          .col(integer(Transactions::FeeId).not_null())
          .foreign_key(
            ForeignKey::create()
              .name("fk_transactions_room_id")
              .from(Transactions::Table, Transactions::RoomNumber)
              .to(Rooms::Table, Rooms::RoomNumber),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_transactions_fee_id")
              .from(Transactions::Table, Transactions::FeeId)
              .to(Fees::Table, Fees::Id),
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
