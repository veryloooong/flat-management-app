use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::{user::types::BasicAccountInfo, AppState};

#[tauri::command]
pub async fn get_user_info<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<BasicAccountInfo, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let client = &state.client;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;

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
      log::error!("Failed to parse user info response: {}", e);
      "Failed to parse user info response".to_string()
    })?;

  log::debug!("Got user info: {:?}", response);

  Ok(response)
}
