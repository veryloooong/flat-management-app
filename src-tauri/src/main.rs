// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client as ReqwestClient;
use tauri::Manager;
use tokio::sync::Mutex;

mod admin;
#[allow(unused)]
mod entities;
mod household;
mod manager;
mod user;

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
      // User commands
      user::account_login,
      user::account_register,
      user::account_recovery,
      user::account_logout,
      // User info commands
      user::info::get_user_info,
      user::info::update_user_info,
      user::info::update_password,
      user::tokens::check_token,
      user::get_user_role,
      // Admin commands
      admin::check_admin,
      admin::get_all_users,
      admin::update_user_status,
      // Manager commands
      crate::manager::get_fees,
      crate::manager::add_fee,
      crate::manager::remove_fee,
      crate::manager::get_fee_info,
      crate::manager::edit_fee_info,
      crate::manager::get_rooms,
      crate::manager::assign_fee,
      crate::manager::get_rooms_detailed,
      // Household commands
      crate::household::get_household_info,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
