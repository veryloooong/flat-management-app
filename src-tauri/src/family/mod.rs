use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::AppState;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct AddFamilyMemberInfo {
  pub name: String,
  pub birthday: chrono::NaiveDate,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct FamilyMemberInfo {
  pub id: i32,
  pub name: String,
  pub birthday: chrono::NaiveDate,
  pub account_id: i32,
}

#[tauri::command]
pub async fn add_family_member<R: Runtime>(
  app: tauri::AppHandle<R>,
  member_info: AddFamilyMemberInfo,
) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;
  let client = &state.client;

  client
    .post(format!("{}/user/family", server_url))
    .bearer_auth(access_token)
    .json(&member_info)
    .send()
    .await
    .map_err(|err| {
      log::error!("Failed to send add family member request: {}", err);
      "Failed to send add family member request".to_string()
    })?;

  Ok(())
}

#[tauri::command]
pub async fn get_family_members<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<Vec<FamilyMemberInfo>, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let server_url = &state.server_url;
  let access_token = state.access_token.clone().ok_or("Not logged in")?;
  let client = &state.client;

  let members = client
    .get(format!("{}/user/family", server_url))
    .bearer_auth(access_token)
    .send()
    .await
    .map_err(|err| {
      log::error!("Failed to send get family members request: {}", err);
      "Failed to send get family members request".to_string()
    })?;

  log::info!("get_family_members response: {:?}", members);

  let members = members
    .json::<Vec<FamilyMemberInfo>>()
    .await
    .map_err(|err| {
      log::error!("Failed to parse get family members response: {}", err);
      "Failed to parse get family members response".to_string()
    })?;

  Ok(members)
}
