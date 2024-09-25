use sea_orm_migration::{prelude::*, schema::*};

use crate::m20220101_000001_create_table::Users;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Sessions::Table)
          .if_not_exists()
          .col(pk_auto(Sessions::Id))
          .col(integer(Sessions::UserId).not_null())
          .col(string(Sessions::Token).not_null())
          .col(
            date_time(Sessions::CreatedAt)
              .not_null()
              .default(Expr::current_timestamp()),
          )
          .col(
            date_time(Sessions::ExpiresAt)
              .not_null()
              .default(Expr::custom_keyword(Alias::new("NOW() + INTERVAL '1 day'"))),
          )
          .foreign_key(
            ForeignKey::create()
              .name("fk-user_id")
              .from(Sessions::Table, Sessions::UserId)
              .to(Users::Table, Users::Id),
          )
          .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Sessions::Table).if_exists().to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum Sessions {
  Table,
  Id,
  UserId,
  Token,
  CreatedAt,
  ExpiresAt,
}
