pub(crate) mod info;
pub mod tokens;
pub mod types;

use crate::entities::sea_orm_active_enums::*;
use crate::AppState;
use types::{AccountRecoveryInfo, LoginResponse, RegisterInfo};

use base64::prelude::*;
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

  let login_err = "Login failed".to_string();

  let response = client
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
    })?;
  // .json()
  // .await
  // .map_err(|e| {
  //   log::error!("Failed to parse login response: {}", e);
  //   login_err.clone()
  // })?;

  let response = response.text().await.map_err(|e| {
    log::error!("Failed to parse login response: {}", e);
    login_err.clone()
  })?;

  if response.contains("unauthorized_client") {
    return Err("unactivated".to_string());
  }

  let response: LoginResponse = serde_json::from_str(&response).map_err(|e| {
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

  let register_err = "Registration failed".to_string();

  let response = client
    .post(&format!("{}/auth/register", server_url))
    .json(&account_info)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send registration request: {}", e);
      register_err.clone()
    })?;

  if response.status().is_success() {
    log::debug!("Registration successful");
    Ok("registration success".to_string())
  } else {
    log::error!("Registration failed: {:?}", response);
    Err(register_err)
  }
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
pub async fn get_user_role<R: Runtime>(app: tauri::AppHandle<R>) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;
  let client = &state.client;

  let response: String = client
    .get(&format!("{}/user/role", server_url))
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

#[derive(Debug, Clone, serde::Deserialize, serde::Serialize)]
pub struct Notification {
  pub id: i32,
  pub title: String,
  pub message: String,
  pub created_at: chrono::NaiveDateTime,
  pub from: String,
  pub to: String,
}

#[tauri::command]
pub async fn get_notifications<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<Vec<Notification>, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;
  let client = &state.client;

  let response: Vec<Notification> = client
    .get(&format!("{}/user/notifications", server_url))
    .bearer_auth(access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send get notifications request: {}", e);
      "Failed to send get notifications request".to_string()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to parse get notifications response: {}", e);
      "Failed to parse get notifications response".to_string()
    })?;

  log::debug!("Notifications: {:?}", &response);

  Ok(response)
}

#[tauri::command]
pub async fn get_basic_user_info<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<serde_json::Value, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;

  let payload = access_token.split('.').nth(1).ok_or("Invalid token")?;
  let payload = BASE64_STANDARD_NO_PAD
    .decode(payload.as_bytes())
    .map_err(|e| e.to_string())?;
  let payload = String::from_utf8(payload).map_err(|e| e.to_string())?;

  let payload: serde_json::Value = serde_json::from_str(&payload).map_err(|e| e.to_string())?;

  Ok(payload)
}
