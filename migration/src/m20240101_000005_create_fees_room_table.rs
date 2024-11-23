use sea_orm_migration::{prelude::*, schema::*};

use crate::m20240101_000001_create_fees_table::Fees;
use crate::m20240101_000003_create_rooms_table::Rooms;

#[derive(DeriveIden)]
pub enum FeesRoom {
  Table,
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
          .table(FeesRoom::Table)
          .if_not_exists()
          .col(integer(FeesRoom::RoomNumber).not_null())
          .col(integer(FeesRoom::FeeId).not_null())
          .primary_key(
            Index::create()
              .col(FeesRoom::RoomNumber)
              .col(FeesRoom::FeeId),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_fees_room_room_number")
              .from(FeesRoom::Table, FeesRoom::RoomNumber)
              .to(Rooms::Table, Rooms::RoomNumber)
              .on_delete(ForeignKeyAction::SetDefault),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_fees_room_fee_id")
              .from(FeesRoom::Table, FeesRoom::FeeId)
              .to(Fees::Table, Fees::Id)
              .on_delete(ForeignKeyAction::Cascade),
          )
          .to_owned(),
      )
      .await?;

    // Insert some data
    let insert_stmt = Query::insert()
      .into_table(FeesRoom::Table)
      .columns(vec![FeesRoom::RoomNumber, FeesRoom::FeeId])
      .values_panic(vec![101.into(), 1.into()])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    Ok(())
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().if_exists().table(FeesRoom::Table).to_owned())
      .await?;

    Ok(())
  }
}
