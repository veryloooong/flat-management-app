use tauri::{Manager, Runtime};

use crate::AppState;
use tokio::sync::Mutex;

#[tauri::command]
pub async fn check_payment<R: Runtime>(app: tauri::AppHandle<R>, id: i32) -> Result<bool, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let client = &state.client;
  let server_url = &state.server_url;
  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;

  let response = client
    .get(&format!("{}/webhook/payment/{id}", server_url))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send check payment request: {}", e);
      "Failed to send check payment request".to_string()
    })?;

  log::debug!("Check payment response: {:?}", response);
  Ok(response.status().is_success())
}
