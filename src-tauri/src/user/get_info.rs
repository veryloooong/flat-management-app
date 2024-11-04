use std::f32::consts::E;

use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::{user::types::BasicAccountInfo, AppState};

use super::refresh_token::get_new_access_token;

// TODO: fix this ugly code
#[tauri::command]
pub async fn get_user_info<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<BasicAccountInfo, String> {
  let state = app.state::<Mutex<AppState>>();
  let mut state = state.lock().await;

  loop {
    let server_url = &state.server_url;
    let client = &state.client;
    let access_token = state.access_token.clone().ok_or("Not logged in")?;

    if state.refresh_token.is_none() || state.access_token.is_none() {
      return Err("Not logged in".to_string());
    }

    let response = client
      .get(format!("{}/user/info", server_url))
      .bearer_auth(access_token)
      .send()
      .await
      .map_err(|e| {
        log::error!("Failed to send user info request: {}", e);
        "Failed to send user info request".to_string()
      })?
      .text()
      .await
      .map_err(|e| {
        log::error!("Failed to read user info response: {}", e);
        "Failed to read user info response".to_string()
      })?;

    let json_res = serde_json::from_str::<serde_json::Value>(&response).map_err(|e| {
      log::error!("Failed to parse user info response: {}", e);
      "Failed to parse user info response".to_string()
    })?;

    if let Some(err) = json_res.get("error") {
      log::error!("User info request failed: {}", err);
      if err.to_string() == "\"invalid_token\"" || err.to_string() == "\"expired_token\"" {
        let token_response = get_new_access_token(
          client,
          server_url,
          &state.refresh_token.clone().ok_or("Not logged in")?,
        )
        .await?;

        state.access_token = Some(token_response.access_token.clone());
        state.refresh_token = Some(token_response.refresh_token.clone());

        continue;
      } else {
        return Err(err.to_string());
      }
    }

    return Ok(serde_json::from_str(&response).map_err(|e| {
      log::error!("Failed to parse user info response: {}", e);
      "Failed to parse user info response".to_string()
    })?);
  }
}
