use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::AppState;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct FeesInfo {
  pub id: i32,
  pub name: String,
  pub amount: i64,
}

#[tauri::command]
pub async fn get_fees<R: Runtime>(app: tauri::AppHandle<R>) -> Result<Vec<FeesInfo>, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response: Vec<FeesInfo> = client
    .get(&format!("{}/manager/fees", server_url))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send fees request: {}", e);
      "Failed to send fees request".to_string()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to parse fees response: {}", e);
      "Failed to parse fees response".to_string()
    })?;

  Ok(response)
}

#[tauri::command]
pub async fn add_fee<R: Runtime>(
  app: tauri::AppHandle<R>,
  name: String,
  amount: i64,
) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response = client
    .post(&format!("{}/manager/fees", server_url))
    .bearer_auth(jwt_access_token)
    .json(&serde_json::json!({
      "name": name,
      "amount": amount,
    }))
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send add fee request: {}", e);
      "Failed to send add fee request".to_string()
    })?;

  if response.status().is_success() {
    Ok(())
  } else {
    Err("Failed to add fee".to_string())
  }
}

#[tauri::command]
pub async fn remove_fee<R: Runtime>(app: tauri::AppHandle<R>, id: i32) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response = client
    .delete(&format!("{}/manager/fees/{}", server_url, id))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send remove fee request: {}", e);
      "Failed to send remove fee request".to_string()
    })?;

  if response.status().is_success() {
    Ok(())
  } else {
    Err("Failed to remove fee".to_string())
  }
}
