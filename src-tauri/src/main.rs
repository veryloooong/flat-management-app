// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client as ReqwestClient;
use tauri::Manager;
use tokio::sync::Mutex;

mod entities;
mod user;

#[tauri::command]
/// Test command to prove IPC works
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Application state, containing the server URL and (secret) tokens.
#[derive(Debug, Clone)]
pub struct AppState {
  /// URL of the webserver to connect to.
  server_url: String,
  /// JWT access token.
  access_token: Option<String>,
  /// JWT refresh token.
  refresh_token: Option<String>,
  /// Web request client.
  client: ReqwestClient,
}

#[tokio::main]
async fn main() {
  dotenvy::from_filename("../.env").ok();
  env_logger::init();
  tauri::async_runtime::set(tokio::runtime::Handle::current());

  let server_url = std::env::var("SERVER_URL").unwrap_or("http://localhost:8080".to_string());

  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      let state = AppState {
        server_url,
        access_token: None,
        refresh_token: None,
        client: reqwest::Client::new(),
      };
      app.manage(Mutex::new(state));
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      greet,
      user::account_login,
      user::account_register,
      user::account_recovery,
      user::get_info::get_user_info,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
