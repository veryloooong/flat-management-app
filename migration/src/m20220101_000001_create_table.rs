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
      .create_type(schema.create_enum_from_active_enum::<UserStatus>())
      .await?;

    manager
      .create_table(
        Table::create()
          .table(Users::Table)
          .if_not_exists()
          .col(pk_auto(Users::Id))
          .col(string(Users::Username).unique_key().not_null())
          .col(string(Users::Email).unique_key().not_null())
          .col(binary_len(Users::Salt, 16).not_null())
          .col(string(Users::Password).not_null())
          .col(
            ColumnDef::new(Users::Role)
              .custom(UserRole::name())
              .default(UserRole::Tenant)
              .not_null(),
          )
          .col(
            ColumnDef::new(Users::Status)
              .custom(UserStatus::name())
              .default(UserStatus::Inactive)
              .not_null(),
          )
          .to_owned(),
      )
      .await?;

    let config = argon2::Config::default();
    let salt = std::iter::repeat_with(|| fastrand::u8(..))
      .take(16)
      .collect::<Vec<u8>>();

    let admin_username = "admin";
    let admin_password = "admin";
    let admin_email = "hailong2004ptcnn@gmail.com";
    let admin_hashed_pw = argon2::hash_encoded(admin_password.as_bytes(), &salt, &config).unwrap();

    let insert_stmt = Query::insert()
      .into_table(Users::Table)
      .columns(vec![
        Users::Username,
        Users::Email,
        Users::Salt,
        Users::Password,
        Users::Role,
        Users::Status,
      ])
      .values_panic([
        admin_username.into(),
        admin_email.into(),
        salt.into(),
        admin_hashed_pw.into(),
        SimpleExpr::Custom("'admin'::user_role".to_string()),
        SimpleExpr::Custom("'active'::user_status".to_string()),
      ])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    Ok(())
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Users::Table).if_exists().to_owned())
      .await?;

    manager
      .drop_type(Type::drop().if_exists().name(UserRole::name()).to_owned())
      .await?;

    manager
      .drop_type(Type::drop().if_exists().name(UserStatus::name()).to_owned())
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
  Status,
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

// Create status enum
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "user_status")]
enum UserStatus {
  #[sea_orm(string_value = "active")]
  Active,
  #[sea_orm(string_value = "inactive")]
  Inactive,
}
