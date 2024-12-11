mod admin;
mod authenticate;
mod entities;
mod household;
mod manager;
mod middleware;
pub mod prelude;
mod router;
pub mod types;
mod user;

use crate::prelude::*;

use router::create_router;
use sea_orm::{sqlx::PgPool, SqlxPostgresConnector};
use shuttle_runtime::SecretStore;

#[derive(Debug, Clone)]
pub(crate) struct AppState {
  pub(crate) db: DatabaseConnection,
  jwt_access_secret: HS256Key,
  jwt_refresh_secret: HS256Key,
}

#[shuttle_runtime::main]
async fn main(
  #[shuttle_runtime::Secrets] secrets: SecretStore,
  #[shuttle_shared_db::Postgres(local_uri = "{secrets.DATABASE_URL}")] pool: PgPool,
) -> shuttle_axum::ShuttleAxum {
  let state = AppState {
    db: SqlxPostgresConnector::from_sqlx_postgres_pool(pool),
    jwt_access_secret: HS256Key::from_bytes(
      hex::decode(
        secrets
          .get("ACCESS_TOKEN_SECRET")
          .expect("ACCESS_TOKEN_SECRET not found"),
      )
      .expect("Failed to decode ACCESS_TOKEN_SECRET")
      .as_slice(),
    ),
    jwt_refresh_secret: HS256Key::from_bytes(
      hex::decode(
        secrets
          .get("REFRESH_TOKEN_SECRET")
          .expect("REFRESH_TOKEN_SECRET not found"),
      )
      .expect("Failed to decode REFRESH_TOKEN_SECRET")
      .as_slice(),
    ),
  };
  let router = create_router(state);

  Ok(router.into())
}
