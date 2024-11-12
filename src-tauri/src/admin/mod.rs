use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::user::types::BasicAccountInfo;
use crate::AppState;

#[tauri::command]
pub async fn check_admin<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let server_url = &state.server_url;
  let client = &state.client;
  let jwt_access_token = state.access_token.clone().ok_or("")?;

  let response = client
    .get(format!("{}/admin/check", server_url))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send admin check request: {}", e);
      "Failed to send admin check request".to_string()
    })?;

  if !response.status().is_success() {
    log::error!("Failed to check admin: {:?}", response);
    return Err("Failed to check admin".to_string());
  }

  Ok(())
}

#[tauri::command]
pub async fn get_all_users<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<Vec<BasicAccountInfo>, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let server_url = &state.server_url;
  let client = &state.client;
  let jwt_access_token = state.access_token.clone().ok_or("")?;

  let response: Vec<BasicAccountInfo> = client
    .get(format!("{}/admin/users", server_url))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send get all users request: {}", e);
      "Failed to send get all users request".to_string()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to parse get all users response: {}", e);
      "Failed to parse get all users response".to_string()
    })?;

  Ok(response)
}
