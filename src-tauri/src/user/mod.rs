use crate::entities::sea_orm_active_enums::*;
use crate::AppState;

use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

#[tauri::command]
pub(crate) async fn account_login<R: Runtime>(
  app: tauri::AppHandle<R>,
  username: String,
  password: String,
) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let mut state = state.lock().await;
  let server_url = &state.server_url;
  let client = &state.client;

  log::debug!("Login attempt for user '{}'", username);
  let login_err = "Login failed".to_string();

  #[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
  #[serde(rename_all = "camelCase")]
  struct LoginResponse {
    access_token: String,
    refresh_token: String,
  }

  let response: LoginResponse = client
    .post(&format!("{}/login", server_url))
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

  log::debug!("Login successful, got tokens: {:?}", response);

  state.access_token = Some(response.access_token);
  state.refresh_token = Some(response.refresh_token);

  Ok("login success".to_string())
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct AccountInfo {
  username: String,
  email: String,
  phone: String,
  password: String,
  role: UserRole,
}

#[tauri::command]
pub(crate) async fn account_register<R: Runtime>(
  app: tauri::AppHandle<R>,
  account_info: AccountInfo,
) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let client = &state.client;

  log::debug!("Registering user '{:?}'", account_info);

  let register_err = "Registration failed".to_string();

  let response = client
    .post(&format!("{}/register", server_url))
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

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
enum AccountRecoveryMethod {
  Email,
  Phone,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct AccountRecoveryInfo {
  username: String,
  method: AccountRecoveryMethod,
  email: Option<String>,
  phone: Option<String>,
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
    .post(&format!("{}/recovery", server_url))
    .json(&recovery_info)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send recovery request: {}", e);
      recovery_err.clone()
    })?
    .text()
    .await
    .map_err(|e| {
      log::error!("Failed to parse recovery response: {}", e);
      recovery_err.clone()
    })?;

  log::debug!("Recovery successful: {}", response);

  Ok("recovery".to_string())
}
