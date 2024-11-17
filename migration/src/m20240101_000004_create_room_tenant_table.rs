use sea_orm_migration::{prelude::*, schema::*};

use crate::m20220101_000001_create_table::Users;
use crate::m20240101_000003_create_rooms_table::Rooms;

#[derive(DeriveIden)]
pub enum RoomTenant {
  Table,
  RoomNumber,
  UserId,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(RoomTenant::Table)
          .if_not_exists()
          .col(integer(RoomTenant::RoomNumber).not_null())
          .col(integer(RoomTenant::UserId).not_null().unique_key())
          .primary_key(
            Index::create()
              .col(RoomTenant::RoomNumber)
              .col(RoomTenant::UserId),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_room_tenant_user_id")
              .from(RoomTenant::Table, RoomTenant::UserId)
              .to(Users::Table, Users::Id),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_room_tenant_room_number")
              .from(RoomTenant::Table, RoomTenant::RoomNumber)
              .to(Rooms::Table, Rooms::RoomNumber),
          )
          .to_owned(),
      )
      .await?;

    // Insert some data
    let insert_stmt = Query::insert()
      .into_table(RoomTenant::Table)
      .columns(vec![RoomTenant::RoomNumber, RoomTenant::UserId])
      .values_panic(vec![101.into(), 3.into()])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    Ok(())
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(
        Table::drop()
          .if_exists()
          .table(RoomTenant::Table)
          .to_owned(),
      )
      .await?;

    Ok(())
  }
}
