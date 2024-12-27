use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .if_not_exists()
          .table(TransactionLogs::Table)
          .col(
            ColumnDef::new(TransactionLogs::Id)
              .integer()
              .not_null()
              .primary_key(),
          )
          .col(ColumnDef::new(TransactionLogs::Gateway).string().not_null())
          .col(
            ColumnDef::new(TransactionLogs::TransactionDate)
              .timestamp()
              .not_null()
              .default(Expr::current_timestamp()),
          )
          .col(
            ColumnDef::new(TransactionLogs::AccountNumber)
              .string()
              .not_null(),
          )
          .col(ColumnDef::new(TransactionLogs::SubAccount).string())
          .col(
            ColumnDef::new(TransactionLogs::TransferAmount)
              .big_integer()
              .not_null(),
          )
          .col(
            ColumnDef::new(TransactionLogs::Accumulated)
              .big_integer()
              .not_null(),
          )
          .col(ColumnDef::new(TransactionLogs::Code).string())
          .col(ColumnDef::new(TransactionLogs::Content).string().not_null())
          .col(ColumnDef::new(TransactionLogs::ReferenceCode).string())
          .col(ColumnDef::new(TransactionLogs::Description).string())
          .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(
        Table::drop()
          .if_exists()
          .table(TransactionLogs::Table)
          .to_owned(),
      )
      .await
  }
}

#[derive(Iden)]
pub enum TransactionLogs {
  Table,
  Id,
  Gateway,
  TransactionDate,
  AccountNumber,
  SubAccount,
  TransferAmount,
  Accumulated,
  Code,
  Content,
  ReferenceCode,
  Description,
}
