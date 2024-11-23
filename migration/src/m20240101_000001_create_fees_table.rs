use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
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
            date(Fees::CreatedAt)
              .not_null()
              .default(Expr::current_timestamp()),
          )
          .col(
            ColumnDef::new(Fees::DueDate)
              .date()
              .not_null()
              .default(Expr::custom_keyword(Alias::new(
                "current_date + interval '1 month'",
              ))),
          )
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
}
