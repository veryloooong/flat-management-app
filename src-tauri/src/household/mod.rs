use crate::AppState;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct FeesRoomInfo {
  room_number: i32,
  fee_id: i32,
  fee_name: String,
  fee_amount: i64,
  due_date: NaiveDateTime,
  payment_date: Option<NaiveDateTime>,
  is_paid: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct PersonalHouseholdInfo {
  room_number: i32,
  tenant_id: i32,
  tenant_name: String,
  tenant_email: String,
  tenant_phone: String,
  fees: Vec<FeesRoomInfo>,
}

#[tauri::command]
pub async fn get_household_info<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<PersonalHouseholdInfo, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let client = &state.client;
  let server_url = &state.server_url;
  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;

  let response: PersonalHouseholdInfo = client
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
