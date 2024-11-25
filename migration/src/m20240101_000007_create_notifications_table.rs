use sea_orm_migration::{prelude::*, schema::*};

use crate::m20220101_000001_create_users_table::Users;

#[derive(DeriveIden)]
pub enum Notifications {
  Table,
  Id,
  Title,
  Message,
  CreatedAt,
  FromUser,
  ToUser,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Notifications::Table)
          .if_not_exists()
          .col(
            integer(Notifications::Id)
              .not_null()
              .auto_increment()
              .primary_key(),
          )
          .col(text(Notifications::Title).not_null())
          .col(text(Notifications::Message).not_null())
          .col(
            timestamp(Notifications::CreatedAt)
              .not_null()
              .default(Expr::current_timestamp()),
          )
          .col(integer(Notifications::FromUser).not_null())
          .col(integer(Notifications::ToUser).not_null())
          .foreign_key(
            ForeignKey::create()
              .name("fk_notifications_from_user")
              .from(Notifications::Table, Notifications::FromUser)
              .to(Users::Table, Users::Id)
              .on_delete(ForeignKeyAction::Cascade),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk_notifications_to_user")
              .from(Notifications::Table, Notifications::ToUser)
              .to(Users::Table, Users::Id)
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
          .table(Notifications::Table)
          .if_exists()
          .to_owned(),
      )
      .await?;

    Ok(())
  }
}
