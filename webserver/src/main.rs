use std::io::Write;

use jwt_simple::prelude::HS256Key;
use router::create_router;
use sea_orm::{prelude::*, Database};
use tokio::net::TcpListener;

mod authenticate;
mod entities;
mod router;

#[derive(Debug, Clone)]
pub(crate) struct AppState {
  pub(crate) db: DatabaseConnection,
  jwt_access_secret: HS256Key,
  jwt_refresh_secret: HS256Key,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  dotenvy::from_filename("../.env")?;
  env_logger::init();

  let db_url = std::env::var("DATABASE_URL")?;
  let db = Database::connect(&db_url).await?;

  let app_state = AppState {
    db,
    jwt_access_secret: HS256Key::from_bytes(
      hex::decode(std::env::var("ACCESS_TOKEN_SECRET")?)?.as_slice(),
    ),
    jwt_refresh_secret: HS256Key::from_bytes(
      hex::decode(std::env::var("REFRESH_TOKEN_SECRET")?)?.as_slice(),
    ),
  };

  let router = create_router(app_state);

  let tcp = TcpListener::bind("127.0.0.1:8080").await?;

  axum::serve(tcp, router).await?;

  Ok(())
}
