use crate::entities::{prelude::*, sea_orm_active_enums::*, users};
use crate::AppState;

use jwt_simple::prelude::*;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, QueryFilter, Set};
use serde_json::json;
use tauri::{Manager, Runtime};
use tokio::sync::Mutex;

/// Login command.
/// Takes a username and password and checks if they match a user in the database. Also checks if the user account is active.
#[tauri::command]
pub(crate) async fn account_login<R: Runtime>(
  app: tauri::AppHandle<R>,
  username: String,
  password: String,
) -> Result<serde_json::Value, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let db = &state.db;
  let access_token = &state.access_token_secret;
  let refresh_token = &state.refresh_token_secret;

  let login_failed_message: String = "Login failed".to_string();

  // Get user info from db
  let user_info = match Users::find()
    .filter(users::Column::Username.eq(&username))
    .one(db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err(login_failed_message);
    }
  };

  let user_info = match user_info {
    Some(user) => user,
    None => {
      return Err(login_failed_message);
    }
  };

  // Check if the user account is active
  if user_info.status != UserStatus::Active {
    log::error!("User account is not active");
    return Err(login_failed_message);
  }

  let salt = user_info.salt;
  let hashed_password = user_info.password;

  // Hash the password
  let argon2_config = argon2::Config::default();
  let password_hash =
    argon2::hash_raw(password.as_bytes(), &salt, &argon2_config).map_err(|e| {
      log::error!("Error hashing password: {:?}", e);
      "Server error".to_string()
    })?;

  // Compare the hashed password with the stored password
  if password_hash != hashed_password {
    log::error!("Login failed");
    return Err(login_failed_message);
  } else {
    log::info!("Login successful");

    // Create a JWT access token
    let access_key = HS256Key::from_bytes(access_token);
    let mut custom_claims = json!({
      "username": username,
      "role": user_info.role,
    });
    let claims = Claims::with_custom_claims(custom_claims.clone(), Duration::from_mins(10));
    let access_token = access_key
      .authenticate(claims)
      .map_err(|e| {
        log::error!("Error creating token: {:?}", e);
        "Server error".to_string()
      })
      .unwrap();

    // Create a JWT refresh token
    let refresh_key = HS256Key::from_bytes(refresh_token);
    custom_claims["refreshTokenVersion"] = json!(1);
    let claims = Claims::with_custom_claims(custom_claims.clone(), Duration::from_hours(24));
    let refresh_token = refresh_key
      .authenticate(claims)
      .map_err(|e| {
        log::error!("Error creating token: {:?}", e);
        "Server error".to_string()
      })
      .unwrap();

    let response = json!({
      "accessToken": access_token,
      "refreshToken": refresh_token,
    });

    return Ok(response);
  }
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct AccountInfo {
  username: String,
  email: String,
  phone: String,
  password: String,
  role: UserRole,
}

/// Register command. Takes a username, email, and password and creates a new user in the database.
/// The password is hashed and salted before being stored.
/// The user is created with the default role of "tenant".
#[tauri::command]
pub(crate) async fn account_register<R: Runtime>(
  app: tauri::AppHandle<R>,
  account_info: AccountInfo,
  // username: String,
  // email: String,
  // phone: String,
  // password: String,
  // role: String,
) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let db = &state.db;

  let AccountInfo {
    username,
    email,
    phone,
    password,
    role,
  } = account_info;

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
    argon2::hash_raw(password.as_bytes(), &salt, &argon2_config).map_err(|e| {
      log::error!("Error hashing password: {:?}", e);
      "Server error".to_string()
    })?;

  // Create the user
  let new_user = users::ActiveModel {
    username: Set(username.clone()),
    email: Set(email.clone()),
    phone: Set(phone.clone()),
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

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
enum AccountRecoveryMethod {
  #[serde(rename = "email")]
  Email,
  #[serde(rename = "phone")]
  Phone,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub(crate) struct AccountRecoveryInfo {
  username: String,
  method: AccountRecoveryMethod,
  email: Option<String>,
  phone: Option<String>,
}

/// Account recovery command. Takes a username and a choice of email or phone number to send a recovery code to.
/// The recovery code is stored in the database and sent to the user.
/// The user can then use the recovery code to reset their password.
#[tauri::command]
pub(crate) async fn account_recovery<R: Runtime>(
  app: tauri::AppHandle<R>,
  recovery_info: AccountRecoveryInfo,
) -> Result<String, String> {
  let state = app.state::<Mutex<AppState>>();
  let state = state.lock().await;
  let _db = &state.db;

  // Get user info from db (todo)

  todo!()

  // Ok("Recovery code sent".to_string())
}
