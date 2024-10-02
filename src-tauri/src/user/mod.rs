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

  log::debug!("Registering user '{:?}'", account_info);

  Ok("register".to_string())
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
enum AccountRecoveryMethod {
  #[serde(rename = "email")]
  Email,
  #[serde(rename = "phone")]
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

  log::debug!("Recovering account '{:?}'", recovery_info);

  Ok("recovery".to_string())
}
