use extension::postgres::Type;
use sea_orm::{ActiveEnum, DbBackend, DeriveActiveEnum, EnumIter, Schema};
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    let schema = Schema::new(DbBackend::Postgres);

    manager
      .create_type(schema.create_enum_from_active_enum::<UserRole>())
      .await?;

    manager
      .create_table(
        Table::create()
          .table(Users::Table)
          .if_not_exists()
          .col(pk_auto(Users::Id))
          .col(string(Users::Username).unique_key().not_null())
          .col(string(Users::Email).unique_key().not_null())
          .col(string(Users::Salt).not_null())
          .col(string(Users::Password).not_null())
          .col(
            ColumnDef::new(Users::Role)
              .custom(UserRole::name())
              .not_null(),
          )
          .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Users::Table).if_exists().to_owned())
      .await?;

    manager
      .drop_type(Type::drop().if_exists().name(UserRole::name()).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
pub enum Users {
  Table,
  Id,
  Username,
  Email,
  Salt,
  Password,
  Role,
}

// Create role enum
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "user_role")]
enum UserRole {
  #[sea_orm(string_value = "admin")]
  Admin,
  #[sea_orm(string_value = "manager")]
  Manager,
  #[sea_orm(string_value = "tenant")]
  Tenant,
}
