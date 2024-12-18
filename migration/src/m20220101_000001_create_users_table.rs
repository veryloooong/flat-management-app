use extension::postgres::Type;
use fake::faker::internet::en::*;
use fake::faker::name::en::*;
use fake::Fake;
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
          // .col(
          //   uuid(Users::Id)
          //     .primary_key()
          //     .default(Expr::cust("uuid_generate_v4()")),
          // )
          // .col(
          //   ColumnDef::new(Users::Id)
          //     .uuid()
          //     .not_null()
          //     .primary_key()
          //     .default(Expr::custom_keyword(Alias::new("uuid_generate_v4()"))),
          // )
          .col(string(Users::Name).not_null())
          .col(string(Users::Username).unique_key().not_null())
          .col(string(Users::Email).unique_key().not_null())
          .col(binary_len(Users::Salt, 16).not_null())
          .col(binary(Users::Password).not_null())
          .col(string(Users::Phone).not_null())
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
          .col(
            ColumnDef::new(Users::RefreshTokenVersion)
              .integer()
              .default(1)
              .not_null(),
          )
          .to_owned(),
      )
      .await?;

    let config = argon2::Config::default();
    let salt = std::iter::repeat_with(|| fastrand::u8(..))
      .take(16)
      .collect::<Vec<u8>>();

    // insert admin user
    let admin_username = "admin";
    let admin_name = "Admin";
    let admin_password = "admin";
    let admin_email = "hailong2004ptcnn@gmail.com";
    let admin_hashed_pw = argon2::hash_raw(admin_password.as_bytes(), &salt, &config).unwrap();

    let insert_stmt = Query::insert()
      .into_table(Users::Table)
      .columns(vec![
        Users::Username,
        Users::Name,
        Users::Email,
        Users::Phone,
        Users::Salt,
        Users::Password,
        Users::Role,
        Users::Status,
      ])
      .values_panic([
        admin_username.into(),
        admin_name.into(),
        admin_email.into(),
        "0927146787".into(),
        salt.clone().into(),
        admin_hashed_pw.into(),
        SimpleExpr::Custom("'admin'::user_role".to_string()),
        SimpleExpr::Custom("'active'::user_status".to_string()),
      ])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    // insert manager user
    let manager_username = "manager";
    let manager_name = "Manager";
    let manager_password = "manager";
    let manager_email = "long.lh224873@sis.hust.edu.vn";
    let manager_hashed_pw = argon2::hash_raw(manager_password.as_bytes(), &salt, &config).unwrap();

    let insert_stmt = Query::insert()
      .into_table(Users::Table)
      .columns(vec![
        Users::Username,
        Users::Name,
        Users::Email,
        Users::Phone,
        Users::Salt,
        Users::Password,
        Users::Role,
        Users::Status,
      ])
      .values_panic([
        manager_username.into(),
        manager_name.into(),
        manager_email.into(),
        "0927146787".into(),
        salt.clone().into(),
        manager_hashed_pw.into(),
        SimpleExpr::Custom("'manager'::user_role".to_string()),
        SimpleExpr::Custom("'active'::user_status".to_string()),
      ])
      .to_owned();

    manager.exec_stmt(insert_stmt).await?;

    for i in 1..=3 {
      let tenant_username = format!("tenant{}", i);
      let tenant_name: String = Name().fake();
      let tenant_password = format!("tenant{}", i);
      let tenant_email: String = FreeEmail().fake();
      let tenant_hashed_pw = argon2::hash_raw(tenant_password.as_bytes(), &salt, &config).unwrap();

      let insert_stmt = Query::insert()
        .into_table(Users::Table)
        .columns(vec![
          Users::Username,
          Users::Name,
          Users::Email,
          Users::Phone,
          Users::Salt,
          Users::Password,
          Users::Role,
          Users::Status,
        ])
        .values_panic([
          tenant_username.into(),
          tenant_name.into(),
          tenant_email.into(),
          "0927146787".into(),
          salt.clone().into(),
          tenant_hashed_pw.into(),
          SimpleExpr::Custom("'tenant'::user_role".to_string()),
          SimpleExpr::Custom("'active'::user_status".to_string()),
        ])
        .to_owned();

      manager.exec_stmt(insert_stmt).await?;
    }

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
  Name,
  Username,
  Email,
  Salt,
  Password,
  Phone,
  Role,
  Status,
  RefreshTokenVersion,
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
