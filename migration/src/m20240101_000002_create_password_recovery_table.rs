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
          .table(PasswordRecoveryRequests::Table)
          .if_not_exists()
          .col(uuid(PasswordRecoveryRequests::Id).not_null().primary_key())
          .col(integer(PasswordRecoveryRequests::UserId).not_null())
          .col(date_time(PasswordRecoveryRequests::RecoveryTime).not_null())
          .foreign_key(
            ForeignKey::create()
              .name("fk-password_recovery_requests-user_id")
              .from(
                PasswordRecoveryRequests::Table,
                PasswordRecoveryRequests::UserId,
              )
              .to(Users::Table, Users::Id),
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
          .if_exists()
          .table(PasswordRecoveryRequests::Table)
          .to_owned(),
      )
      .await?;

    Ok(())
  }
}

#[derive(DeriveIden)]
pub enum PasswordRecoveryRequests {
  Table,
  Id,
  UserId,
  RecoveryTime,
}
