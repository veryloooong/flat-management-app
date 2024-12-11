// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client as ReqwestClient;
use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

mod admin;
#[allow(unused)]
mod entities;
mod household;
mod manager;
mod user;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct Settings {
  server_url: Option<String>,
}

#[tauri::command]
async fn update_settings<R: Runtime>(app: tauri::AppHandle<R>, data: Settings) -> Result<(), ()> {
  let state = app.state::<Mutex<AppState>>();
  let mut state = state.lock().await;
  state.server_url = data
    .server_url
    .unwrap_or("https://it3180-app-webserver-7tst.shuttle.app".to_string());

  Ok(())
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
  dotenvy::from_filename("../.env.local").ok();
  env_logger::init();
  tauri::async_runtime::set(tokio::runtime::Handle::current());

  #[cfg(debug_assertions)]
  let server_url = match std::env::var("SERVER_URL") {
    Ok(url) => url,
    Err(_) => {
      eprintln!("No SERVER_URL environment variable set, setting to default server.");
      "http://localhost:8080".to_string()
    }
  };

  #[cfg(not(debug_assertions))]
  let server_url = "https://it3180-app-webserver-7tst.shuttle.app".to_string();

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
      user::get_notifications,
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
      crate::manager::send_notification,
      // Household commands
      crate::household::get_household_info,
      crate::household::pay_fee,
      // Other commands
      update_settings
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
