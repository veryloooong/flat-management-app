pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_table;
mod m20240101_000001_create_fees_table;
mod m20240101_000002_create_password_recovery_table;
mod m20240101_000003_create_rooms_table;
mod m20240101_000004_create_room_tenant_table;
mod m20240101_000005_create_fees_room_table;
mod m20240101_000006_create_transactions_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
  fn migrations() -> Vec<Box<dyn MigrationTrait>> {
    vec![
      Box::new(m20220101_000001_create_table::Migration),
      Box::new(m20240101_000001_create_fees_table::Migration),
      Box::new(m20240101_000002_create_password_recovery_table::Migration),
      Box::new(m20240101_000003_create_rooms_table::Migration),
      // Box::new(m20240101_000004_create_room_tenant_table::Migration),
      Box::new(m20240101_000005_create_fees_room_table::Migration),
      Box::new(m20240101_000006_create_transactions_table::Migration),
    ]
  }
}
