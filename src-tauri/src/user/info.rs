use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::{user::types::BasicAccountInfo, AppState};

use super::types::{UpdatePasswordInfo, UpdateUserInfo};

// TODO: fix this ugly code
#[tauri::command]
pub async fn get_user_info<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<BasicAccountInfo, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let server_url = &state.server_url;
  let client = &state.client;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;

  if state.refresh_token.is_none() || state.access_token.is_none() {
    return Err("Not logged in".to_string());
  }

  let response: BasicAccountInfo = client
    .get(format!("{}/user/info", server_url))
    .bearer_auth(access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send user info request: {}", e);
      "Failed to send user info request".to_string()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to read user info response: {}", e);
      "Failed to read user info response".to_string()
    })?;

  Ok(response)
}

#[tauri::command]
pub async fn update_user_info<R: Runtime>(
  app: tauri::AppHandle<R>,
  info: UpdateUserInfo,
) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let client = &state.client;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;

  let response = client
    .put(format!("{}/user/info", server_url))
    .bearer_auth(access_token)
    .json(&info)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send user info update request: {}", e);
      "Failed to send user info update request".to_string()
    })?;

  if !response.status().is_success() {
    log::error!("Failed to update user info: {:?}", response);
    return Err("Failed to update user info".to_string());
  }

  Ok(())
}

#[tauri::command]
pub async fn update_password<R: Runtime>(
  app: tauri::AppHandle<R>,
  password_info: UpdatePasswordInfo,
) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let client = &state.client;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;

  let response = client
    .put(format!("{}/user/password", server_url))
    .bearer_auth(access_token)
    .json(&password_info)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send password update request: {}", e);
      "Failed to send password update request".to_string()
    })?;

  if !response.status().is_success() {
    log::error!("Failed to update password: {:?}", response);
    return Err("Failed to update password".to_string());
  }

  Ok(())
}
