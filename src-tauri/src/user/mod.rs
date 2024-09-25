// #[tauri::command]
// pub(crate) fn login() {
//   println!("Logging in...");
// }

use crate::entities::{prelude::*, users};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

use crate::AppState;

#[tauri::command]
pub(crate) async fn login<R: Runtime>(
  app: tauri::AppHandle<R>,
  username: String,
  password: String,
) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let db = &state.db;

  // Get user info from db
  let user_info = match Users::find()
    .filter(users::Column::Username.eq(username))
    .one(db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err("User not found".to_string());
    }
  };

  let user_info = match user_info {
    Some(user) => user,
    None => {
      log::error!("User not found");
      return Err("User not found".to_string());
    }
  };

  let salt = user_info.salt;
  let hashed_password = user_info.password;

  // Hash the password
  let argon2_config = argon2::Config::default();
  let password_hash = argon2::hash_encoded(password.as_bytes(), salt.as_bytes(), &argon2_config)
    .expect("Server error");

  // Compare the hashed password with the stored password
  if password_hash != hashed_password {
    log::error!("Login failed");
    return Err("Login failed".to_string());
  } else {
    log::info!("Login successful");
    return Ok("Login successful".to_string());
  }
}
