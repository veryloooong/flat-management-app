use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20220101_000001_create_users_table::Users, m20240101_000001_create_fees_table::Fees};

#[derive(DeriveIden)]
pub enum Family {
  Table,
  Id,
  Name,
  Birthday,
  AccountId,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Family::Table)
          .if_not_exists()
          .col(
            integer(Family::Id)
              .not_null()
              .auto_increment()
              .primary_key(),
          )
          .col(text(Family::Name).not_null())
          .col(
            date(Family::Birthday)
              .not_null()
              .default(Expr::current_date()),
          )
          .col(integer(Family::AccountId).not_null())
          .foreign_key(
            ForeignKey::create()
              .name("fk_family_account_id")
              .from(Family::Table, Family::AccountId)
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
      .drop_table(Table::drop().table(Family::Table).if_exists().to_owned())
      .await?;

    Ok(())
  }
}
