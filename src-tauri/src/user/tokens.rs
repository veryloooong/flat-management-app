use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::AppState;

use super::types::LoginResponse;

/// Get a new access token using a refresh token.
pub async fn get_new_access_token(
  client: &reqwest::Client,
  server_url: &str,
  refresh_token: &str,
) -> Result<LoginResponse, String> {
  let response = client
    .post(&format!("{}/auth/refresh", server_url))
    .header("Content-Type", "application/json")
    .json(&serde_json::json!({ "refresh_token": refresh_token }))
    .send()
    .await
    .map_err(|e| format!("Failed to send request: {}", e))?
    .json::<LoginResponse>()
    .await
    .map_err(|e| format!("Failed to parse response: {}", e))?;

  Ok(response)
}

/// Check if the token is valid.
#[tauri::command]
pub async fn check_token<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let mut state = state.lock().await;

  // loop to get a new access token if the current one is invalid
  loop {
    let server_url = &state.server_url;
    let client = &state.client;
    let access_token = state.access_token.clone().ok_or("Not logged in")?;
    let refresh_token = state.refresh_token.clone().ok_or("Not logged in")?;

    let response = client
      .get(format!("{}/user/check", server_url))
      .bearer_auth(access_token)
      .send()
      .await
      .map_err(|e| {
        log::error!("Failed to send check token request: {}", e);
        "Failed to send check token request".to_string()
      })?;

    if response.status().is_success() {
      break;
    }

    let new_token = get_new_access_token(client, server_url, &refresh_token).await?;

    state.access_token = Some(new_token.access_token.clone());
    state.refresh_token = Some(new_token.refresh_token.clone());
  }

  Ok(())
}
