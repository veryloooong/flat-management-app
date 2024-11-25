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
use tokio::net::TcpListener;

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

  println!("Listening on: {}\n", tcp.local_addr()?);
  println!(
    "Go to http://{}/api/ to see the API documentation\n",
    tcp.local_addr()?
  );

  axum::serve(tcp, router).await?;

  Ok(())
}
