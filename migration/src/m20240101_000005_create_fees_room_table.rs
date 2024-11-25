use sea_orm_migration::{prelude::*, schema::*};

use crate::m20240101_000001_create_fees_table::Fees;
use crate::m20240101_000003_create_rooms_table::Rooms;

#[derive(DeriveIden)]
pub enum FeesRoomAssignment {
  Table,
  AssignmentId,
  RoomNumber,
  FeeId,
  DueDate,
  PaymentDate,
  IsPaid,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(FeesRoomAssignment::Table)
          .if_not_exists()
          .col(
            integer(FeesRoomAssignment::AssignmentId)
              .not_null()
              .auto_increment()
              .primary_key(),
          )
          .col(integer(FeesRoomAssignment::RoomNumber).not_null())
          .col(integer(FeesRoomAssignment::FeeId).not_null())
          .col(
            ColumnDef::new(FeesRoomAssignment::DueDate)
              .timestamp()
              .not_null()
              .default(Expr::custom_keyword(Alias::new(
                "current_date + interval '1 month'",
              ))),
          )
          .col(timestamp_null(FeesRoomAssignment::PaymentDate))
          .col(boolean(FeesRoomAssignment::IsPaid).default(false))
          .foreign_key(
            ForeignKey::create()
              .name("fk_fees_room_room_number")
              .from(FeesRoomAssignment::Table, FeesRoomAssignment::RoomNumber)
              .to(Rooms::Table, Rooms::RoomNumber)
              .on_delete(ForeignKeyAction::SetDefault),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_fees_room_fee_id")
              .from(FeesRoomAssignment::Table, FeesRoomAssignment::FeeId)
              .to(Fees::Table, Fees::Id)
              .on_delete(ForeignKeyAction::Cascade),
          )
          .to_owned(),
      )
      .await?;

    manager
      .create_index(
        Index::create()
          .table(FeesRoomAssignment::Table)
          .name("unique_fee_room_assignment")
          .unique()
          .col(FeesRoomAssignment::RoomNumber)
          .col(FeesRoomAssignment::FeeId)
          .to_owned(),
      )
      .await?;

    // Insert some data
    let insert_stmt = Query::insert()
      .into_table(FeesRoomAssignment::Table)
      .columns(vec![
        FeesRoomAssignment::RoomNumber,
        FeesRoomAssignment::FeeId,
      ])
      .values_panic(vec![101.into(), 1.into()])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    Ok(())
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(
        Table::drop()
          .if_exists()
          .table(FeesRoomAssignment::Table)
          .to_owned(),
      )
      .await?;

    Ok(())
  }
}
