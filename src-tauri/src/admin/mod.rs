use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

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
