// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use jwt_simple::prelude::*;
use sea_orm::{Database, DatabaseConnection};
use tauri::Manager;
use tokio::sync::Mutex;

mod entities;
mod user;

/// Test command to prove IPC works
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

/// The global state of the application, currently contains the database connection.
#[derive(Debug, Clone)]
pub struct AppState {
  db: DatabaseConnection,        // Database connection
  access_token_secret: Vec<u8>,  // Secret for JWT access tokens
  refresh_token_secret: Vec<u8>, // Secret for JWT refresh tokens
}

#[tokio::main]
async fn main() {
  env_logger::init();
  dotenvy::from_filename("../.env").ok();
  tauri::async_runtime::set(tokio::runtime::Handle::current());

  let db_url = std::env::var("DATABASE_URL").expect("database not found");
  let db = Database::connect(&db_url)
    .await
    .expect("database connection failed");

  tauri::Builder::default()
    .setup(|app| {
      let state = AppState {
        db,
        access_token_secret: hex::decode(
          std::env::var("ACCESS_TOKEN_SECRET").expect("access token secret not found"),
        )
        .expect("invalid access token secret"),
        refresh_token_secret: hex::decode(
          std::env::var("REFRESH_TOKEN_SECRET").expect("refresh token secret not found"),
        )
        .expect("invalid refresh token secret"),
      };
      app.manage(Mutex::new(state));
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      greet,
      user::account_login,
      user::account_register,
      user::account_recovery
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
