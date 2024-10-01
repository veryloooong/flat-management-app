// #[tauri::command]
// pub(crate) fn login() {
//   println!("Logging in...");
// }

use crate::entities::{prelude::*, sea_orm_active_enums::*, users};
use crate::AppState;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, QueryFilter, Set};
use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

/// Login command. Takes a username and password and checks if they match a user in the database.
#[tauri::command]
pub(crate) async fn account_login<R: Runtime>(
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
  let password_hash =
    argon2::hash_encoded(password.as_bytes(), &salt, &argon2_config).map_err(|e| {
      log::error!("Error hashing password: {:?}", e);
      "Server error".to_string()
    })?;

  // Compare the hashed password with the stored password
  if password_hash != hashed_password {
    log::error!("Login failed");
    return Err("Login failed".to_string());
  } else {
    log::info!("Login successful");
    return Ok("Login successful".to_string());
  }
}

/// Register command. Takes a username, email, and password and creates a new user in the database.
/// The password is hashed and salted before being stored.
/// The user is created with the default role of "tenant".
#[tauri::command]
pub(crate) async fn account_register<R: Runtime>(
  app: tauri::AppHandle<R>,
  username: String,
  email: String,
  password: String,
  role: String,
) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let db = &state.db;

  // Check if the user already exists by username or email
  let user_exists = Users::find()
    // .filter(users::Column::Username.eq(username.clone()))
    .filter(
      Condition::any()
        .add(users::Column::Username.eq(username.clone()))
        .add(users::Column::Email.eq(email.clone())),
    )
    .one(db)
    .await
    .map_err(|e| {
      log::error!("Error: {:?}", e);
      "Server error".to_string()
    })?;

  if user_exists.is_some() {
    log::error!("User already exists");
    return Err("User already exists".to_string());
  }

  // Hash the password
  let argon2_config = argon2::Config::default();
  let mut rng = fastrand::Rng::new();
  let salt = std::iter::repeat_with(|| rng.u8(..))
    .take(16)
    .collect::<Vec<u8>>();

  let hashed_password =
    argon2::hash_encoded(password.as_bytes(), &salt, &argon2_config).map_err(|e| {
      log::error!("Error hashing password: {:?}", e);
      "Server error".to_string()
    })?;

  let role = match role.as_str() {
    "admin" => UserRole::Admin,
    "manager" => UserRole::Manager,
    "tenant" => UserRole::Tenant,
    _ => {
      log::error!("Invalid role");
      return Err("User create error".to_string());
    }
  };

  // Create the user
  let new_user = users::ActiveModel {
    username: Set(username.clone()),
    email: Set(email.clone()),
    salt: Set(salt.clone()),
    password: Set(hashed_password.clone()),
    role: Set(role),
    ..Default::default()
  };

  new_user.insert(db).await.map_err(|e| {
    log::error!("Error creating user: {:?}", e);
    "User create error".to_string()
  })?;

  Ok("User created".to_string())
}
