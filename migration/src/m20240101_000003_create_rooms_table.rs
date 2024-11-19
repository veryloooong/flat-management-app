use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveIden)]
pub enum Rooms {
  Table,
  RoomNumber,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Rooms::Table)
          .if_not_exists()
          .col(integer(Rooms::RoomNumber).not_null().primary_key())
          .to_owned(),
      )
      .await?;

    // Insert some data
    let insert_stmt = Query::insert()
      .into_table(Rooms::Table)
      .columns(vec![Rooms::RoomNumber])
      .values_panic(vec![101.into()])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    let insert_stmt = Query::insert()
      .into_table(Rooms::Table)
      .columns(vec![Rooms::RoomNumber])
      .values_panic(vec![201.into()])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    Ok(())
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().if_exists().table(Rooms::Table).to_owned())
      .await?;

    Ok(())
  }
}
