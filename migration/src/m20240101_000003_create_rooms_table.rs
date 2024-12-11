use sea_orm_migration::{prelude::*, schema::*};

use crate::m20220101_000001_create_users_table::Users;

#[derive(DeriveIden)]
pub enum Rooms {
  Table,
  RoomNumber,
  TenantId,
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
          .col(integer(Rooms::TenantId).not_null().unique_key())
          .foreign_key(
            ForeignKey::create()
              .from(Rooms::Table, Rooms::TenantId)
              .to(Users::Table, Users::Id),
          )
          .to_owned(),
      )
      .await?;

    for i in 1..=3 {
      let room_number = 100 + i;
      let tenant_id = i + 2;
      let insert_stmt = Query::insert()
        .into_table(Rooms::Table)
        .columns(vec![Rooms::RoomNumber, Rooms::TenantId])
        .values_panic(vec![room_number.into(), tenant_id.into()])
        .to_owned();

      manager.exec_stmt(insert_stmt).await?;
    }

    Ok(())
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().if_exists().table(Rooms::Table).to_owned())
      .await?;

    Ok(())
  }
}
