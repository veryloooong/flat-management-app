pub(crate) mod info;
pub mod tokens;
pub mod types;

use crate::entities::sea_orm_active_enums::*;
use crate::AppState;
use types::{AccountRecoveryInfo, LoginResponse, RegisterInfo};

use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

#[tauri::command]
pub(crate) async fn account_login<R: Runtime>(
  app: tauri::AppHandle<R>,
  username: String,
  password: String,
) -> Result<LoginResponse, String> {
  let state = app.state::<Mutex<AppState>>();
  let mut state = state.lock().await;
  let server_url = &state.server_url;
  let client = &state.client;

  log::debug!("Login attempt for user '{}'", username);
  let login_err = "Login failed".to_string();

  let response: LoginResponse = client
    .post(&format!("{}/auth/login", server_url))
    .json(&serde_json::json!({
      "username": username,
      "password": password,
    }))
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send login request: {}", e);
      login_err.clone()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to parse login response: {}", e);
      login_err.clone()
    })?;

  state.access_token = Some(response.access_token.clone());
  state.refresh_token = Some(response.refresh_token.clone());

  Ok(response)
}

#[tauri::command]
pub(crate) async fn account_register<R: Runtime>(
  app: tauri::AppHandle<R>,
  account_info: RegisterInfo,
) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let client = &state.client;

  log::debug!("Registering user '{:?}'", account_info);

  let register_err = "Registration failed".to_string();

  let response = client
    .post(&format!("{}/auth/register", server_url))
    .json(&account_info)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send registration request: {}", e);
      register_err.clone()
    })?
    .text()
    .await
    .map_err(|e| {
      log::error!("Failed to parse registration response: {}", e);
      register_err.clone()
    })?;

  log::debug!("Registration successful: {}", response);

  Ok("registration success".to_string())
}

#[tauri::command]
pub(crate) async fn account_recovery<R: Runtime>(
  app: tauri::AppHandle<R>,
  recovery_info: AccountRecoveryInfo,
) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let client = &state.client;

  log::debug!("Recovering account '{:?}'", recovery_info);

  let recovery_err = "Recovery failed".to_string();

  let response = client
    .post(&format!("{}/auth/recover", server_url))
    .json(&recovery_info)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send recovery request: {}", e);
      recovery_err.clone()
    })?;

  if response.status().is_success() {
    log::debug!("Recovery successful");
  } else {
    log::error!("Recovery failed: {:?}", response);
    return Err(recovery_err);
  }

  Ok("recovery".to_string())
}

#[tauri::command]
pub(crate) async fn account_logout<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let mut state = state.lock().await;
  let server_url = &state.server_url;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;
  let client = &state.client;

  log::debug!("Logging out user");

  let logout_err = "Logout failed".to_string();

  let _ = client
    .post(&format!("{}/auth/logout", server_url))
    .bearer_auth(access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send logout request: {}", e);
      logout_err.clone()
    })?
    .text()
    .await
    .map_err(|e| {
      log::error!("Failed to parse logout response: {}", e);
      logout_err.clone()
    })?;

  state.access_token = None;
  state.refresh_token = None;

  Ok(())
}

#[tauri::command]
async fn get_user_info<R: Runtime>(app: tauri::AppHandle<R>) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;
  let client = &state.client;

  let response: String = client
    .get(&format!("{}/user/info", server_url))
    .bearer_auth(access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send get user info request: {}", e);
      "Failed to send get user info request".to_string()
    })?
    .text()
    .await
    .map_err(|e| {
      log::error!("Failed to parse get user info response: {}", e);
      "Failed to parse get user info response".to_string()
    })?;

  Ok(response)
}
