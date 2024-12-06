use extension::postgres::Type;
use sea_orm::{ActiveEnum, DbBackend, DeriveActiveEnum, EnumIter, Schema};

use sea_orm_migration::{prelude::*, schema::*};

#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "recurrence_type")]
pub enum RecurrenceType {
  #[sea_orm(string_value = "weekly")]
  Weekly,
  #[sea_orm(string_value = "monthly")]
  Monthly,
  #[sea_orm(string_value = "yearly")]
  Yearly,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    let schema = Schema::new(DbBackend::Postgres);
    manager
      .create_type(schema.create_enum_from_active_enum::<RecurrenceType>())
      .await?;

    manager
      .create_table(
        Table::create()
          .table(Fees::Table)
          .if_not_exists()
          .col(pk_auto(Fees::Id))
          .col(string(Fees::Name).not_null())
          .col(big_integer(Fees::Amount).not_null())
          .col(boolean(Fees::IsRequired).not_null().default(false))
          .col(
            timestamp(Fees::CreatedAt)
              .not_null()
              .default(Expr::current_timestamp()),
          )
          .col(boolean(Fees::IsRecurring).not_null().default(false))
          .col(
            ColumnDef::new(Fees::DueDate)
              .timestamp()
              .not_null()
              .default(Expr::custom_keyword(Alias::new(
                "current_date + interval '1 month'",
              ))),
          )
          .col(ColumnDef::new(Fees::RecurrenceType).custom(RecurrenceType::name()))
          .to_owned(),
      )
      .await?;

    // Insert dummy data
    let insert_stmt = Query::insert()
      .into_table(Fees::Table)
      .columns(vec![Fees::Name, Fees::Amount, Fees::IsRequired])
      .values_panic(vec!["Phí vệ sinh".into(), 200000.into(), true.into()])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    let insert_stmt = Query::insert()
      .into_table(Fees::Table)
      .columns(vec![Fees::Name, Fees::Amount, Fees::IsRequired])
      .values_panic(vec!["Phí quản lý".into(), 500000.into(), true.into()])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    let insert_stmt = Query::insert()
      .into_table(Fees::Table)
      .columns(vec![Fees::Name, Fees::Amount, Fees::IsRequired])
      .values_panic(vec!["Phí abcdef".into(), 1000000.into(), false.into()])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    Ok(())
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Fees::Table).if_exists().to_owned())
      .await?;

    manager
      .drop_type(
        Type::drop()
          .name(RecurrenceType::name())
          .if_exists()
          .to_owned(),
      )
      .await?;

    Ok(())
  }
}

#[derive(DeriveIden)]
pub enum Fees {
  Table,
  Id,
  Name,
  Amount,
  IsRequired,
  CreatedAt,
  DueDate,
  IsRecurring,
  RecurrenceType,
}
