use crate::{entities::sea_orm_active_enums::*, AppState};
use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct HouseholdInfo {
  pub id: i32,
  pub name: String,
  pub username: String,
  pub email: String,
  pub phone: String,
  pub role: UserRole,
  pub status: UserStatus,
  pub room_number: i32,
}

#[tauri::command]
pub async fn get_household_info<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<HouseholdInfo, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let client = &state.client;
  let server_url = &state.server_url;
  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;

  let response: HouseholdInfo = client
    .get(&format!("{}/user/household", server_url))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send household info request: {}", e);
      "Failed to send household info request".to_string()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to parse household info response: {}", e);
      "Failed to parse household info response".to_string()
    })?;

  Ok(response)
}
