use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::{household::FeesRoomInfo, AppState};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct BasicFeeInfo {
  pub id: i32,
  pub name: String,
  pub amount: i64,
  pub due_date: chrono::NaiveDateTime,
}

#[tauri::command]
pub async fn get_fees<R: Runtime>(app: tauri::AppHandle<R>) -> Result<Vec<BasicFeeInfo>, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response: Vec<BasicFeeInfo> = client
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

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct AddFeeInfo {
  pub name: String,
  pub amount: i64,
  pub is_required: bool,
  pub due_date: chrono::NaiveDateTime,
  pub recurrence_type: Option<String>,
}

#[tauri::command]
pub async fn add_fee<R: Runtime>(app: tauri::AppHandle<R>, info: AddFeeInfo) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response = client
    .post(&format!("{}/manager/fees", server_url))
    .bearer_auth(jwt_access_token)
    .json(&info)
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

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct DetailedFeeInfo {
  pub id: i32,
  pub name: String,
  pub amount: i64,
  pub is_required: bool,
  pub created_at: String,
  pub due_date: String,
  pub recurrence_type: Option<String>,
  pub fee_assignments: Vec<FeesRoomInfo>,
}

#[tauri::command]
pub async fn get_fee_info<R: Runtime>(
  app: tauri::AppHandle<R>,
  fee_id: i32,
) -> Result<DetailedFeeInfo, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response: DetailedFeeInfo = client
    .get(&format!("{}/manager/fees/{}", server_url, fee_id))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send get fee info request: {}", e);
      "Failed to send get fee info request".to_string()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to parse get fee info response: {}", e);
      "Failed to parse get fee info response".to_string()
    })?;

  log::debug!("Got fee info: {:?}", response);

  Ok(response)
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct EditFeeInfo {
  pub name: String,
  pub amount: i64,
  pub is_required: bool,
  pub due_date: chrono::NaiveDateTime,
  pub recurrence_type: Option<String>,
}

#[tauri::command]
pub async fn edit_fee_info<R: Runtime>(
  app: tauri::AppHandle<R>,
  id: i32,
  info: EditFeeInfo,
) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response = client
    .put(&format!("{}/manager/fees/{}", server_url, id))
    .bearer_auth(jwt_access_token)
    .json(&info)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send edit fee info request: {}", e);
      "Failed to send edit fee info request".to_string()
    })?;

  if response.status().is_success() {
    Ok(())
  } else {
    Err("Failed to edit fee info".to_string())
  }
}

#[tauri::command]
pub async fn get_rooms<R: Runtime>(app: tauri::AppHandle<R>) -> Result<Vec<i32>, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response: Vec<i32> = client
    .get(&format!("{}/manager/rooms", server_url))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send rooms request: {}", e);
      "Failed to send rooms request".to_string()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to parse rooms response: {}", e);
      "Failed to parse rooms response".to_string()
    })?;

  Ok(response)
}

#[tauri::command]
pub async fn assign_fee<R: Runtime>(
  app: tauri::AppHandle<R>,
  fee_id: i32,
  room_numbers: Vec<i32>,
) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response = client
    .post(&format!("{}/manager/fees/{}/assign", server_url, fee_id))
    .bearer_auth(jwt_access_token)
    .json(&room_numbers)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send assign fee request: {}", e);
      "Failed to send assign fee request".to_string()
    })?;

  if response.status().is_success() {
    Ok(())
  } else {
    Err("Failed to assign fee".to_string())
  }
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct DetailedRoomInfo {
  room_number: i32,
  tenant_id: i32,
  tenant_name: String,
  tenant_email: String,
  tenant_phone: String,
}

#[tauri::command]
pub async fn get_rooms_detailed<R: Runtime>(
  app: tauri::AppHandle<R>,
) -> Result<Vec<DetailedRoomInfo>, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response: Vec<DetailedRoomInfo> = client
    .get(&format!("{}/manager/rooms/detailed", server_url))
    .bearer_auth(jwt_access_token)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send rooms detailed request: {}", e);
      "Failed to send rooms detailed request".to_string()
    })?
    .json()
    .await
    .map_err(|e| {
      log::error!("Failed to parse rooms detailed response: {}", e);
      "Failed to parse rooms detailed response".to_string()
    })?;

  Ok(response)
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct SendNotificationInfo {
  pub title: String,
  pub message: String,
  pub to_user: Option<String>,
  pub send_all: bool,
}

#[tauri::command]
pub async fn send_notification<R: Runtime>(
  app: tauri::AppHandle<R>,
  info: SendNotificationInfo,
) -> Result<(), String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;

  let jwt_access_token = state.access_token.clone().ok_or("Not logged in")?;
  let server_url = &state.server_url;
  let client = &state.client;

  let response = client
    .post(&format!("{}/manager/notifications", server_url))
    .bearer_auth(jwt_access_token)
    .json(&info)
    .send()
    .await
    .map_err(|e| {
      log::error!("Failed to send send notification request: {}", e);
      "Failed to send send notification request".to_string()
    })?;

  if response.status().is_success() {
    Ok(())
  } else {
    Err("Failed to send notification".to_string())
  }
}
