use extension::postgres::Type;
use sea_orm::{ActiveEnum, DbBackend, DeriveActiveEnum, EnumIter, Schema};
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20240101_000001_create_fees_table::Fees;

#[derive(DeriveIden)]
pub enum FeeRecurrence {
  Table,
  RecurrenceId,
  FeeId,
  PreviousFeeId,
  DueDate,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(FeeRecurrence::Table)
          .if_not_exists()
          .col(
            integer(FeeRecurrence::RecurrenceId)
              .not_null()
              .auto_increment()
              .primary_key(),
          )
          .col(integer(FeeRecurrence::FeeId).not_null().unique_key())
          .col(integer(FeeRecurrence::PreviousFeeId))
          .col(
            ColumnDef::new(FeeRecurrence::DueDate)
              .timestamp()
              .not_null(),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_fee_recurrence_fee_id")
              .from(FeeRecurrence::Table, FeeRecurrence::FeeId)
              .to(Fees::Table, Fees::Id)
              .on_delete(ForeignKeyAction::Cascade),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_fee_recurrence_previous_fee_id")
              .from(FeeRecurrence::Table, FeeRecurrence::PreviousFeeId)
              .to(Fees::Table, Fees::Id)
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
          .table(FeeRecurrence::Table)
          .if_exists()
          .to_owned(),
      )
      .await?;

    Ok(())
  }
}
