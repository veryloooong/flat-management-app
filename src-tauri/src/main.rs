// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sea_orm::{Database, DatabaseConnection};
use tauri::Manager;
use tokio::sync::Mutex;

mod entities;
mod user;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

// Global app state
#[derive(Debug, Clone)]
pub struct AppState {
  db: DatabaseConnection,
}

#[tokio::main]
async fn main() {
  dotenvy::from_filename(".env.local").ok();
  env_logger::init();
  tauri::async_runtime::set(tokio::runtime::Handle::current());

  let db_url = std::env::var("DATABASE_URL").expect("database not found");
  dbg!(&db_url);

  let db = Database::connect(&db_url)
    .await
    .expect("database connection failed");

  tauri::Builder::default()
    .setup(|app| {
      let state = AppState { db };
      app.manage(Mutex::new(state));
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![greet, user::login])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
