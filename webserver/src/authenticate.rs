use crate::entities::sea_orm_active_enums::*;
use crate::entities::{prelude::*, users};
use crate::AppState;

use axum::http::{header, StatusCode};
use axum::{extract::State, response::IntoResponse, Json};
use jwt_simple::prelude::*;
use sea_orm::{prelude::*, Condition, Set};
use serde_json::json;

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub(crate) struct LoginInfo {
  username: String,
  password: String,
}

/// Login command.
/// Takes a username and password and checks if they match a user in the database. Also checks if the user account is active.
pub(crate) async fn account_login(
  State(state): State<AppState>,
  Json(login_info): Json<LoginInfo>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let AppState {
    db,
    jwt_access_secret,
    jwt_refresh_secret,
  } = &state;

  let login_err = Err((StatusCode::UNAUTHORIZED, "Login failed"));

  // Get user info from db
  let user_info = match Users::find()
    .filter(users::Column::Username.eq(&login_info.username))
    .one(db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return login_err;
    }
  };

  let user_info = match user_info {
    Some(user) => user,
    None => {
      return login_err;
    }
  };

  // Check if the user account is active
  if user_info.status != UserStatus::Active {
    log::error!("User account is not active");
    return login_err;
  }

  let salt = user_info.salt;
  let hashed_password = user_info.password;

  // Hash the password
  let argon2_config = argon2::Config::default();
  let password =
    argon2::hash_raw(login_info.password.as_bytes(), &salt, &argon2_config).map_err(|e| {
      log::error!("Error hashing password: {:?}", e);
      login_err.clone().err().unwrap()
    })?;

  if password != hashed_password {
    return login_err;
  } else {
    log::info!(
      "login attempt by {} at {}",
      login_info.username,
      chrono::Utc::now()
    );

    // Create JWT
    let mut custom_claims = json!({
      "username": user_info.username,
      "role": user_info.role,
    });
    let claims = Claims::with_custom_claims(custom_claims.clone(), Duration::from_mins(15));
    let access_token = jwt_access_secret.authenticate(claims).map_err(|e| {
      log::error!("Error creating access token: {:?}", e);
      login_err.clone().err().unwrap()
    })?;

    custom_claims["refreshTokenVersion"] = json!(1);
    let claims = Claims::with_custom_claims(custom_claims.clone(), Duration::from_hours(24));
    let refresh_token = jwt_refresh_secret.authenticate(claims).map_err(|e| {
      log::error!("Error creating refresh token: {:?}", e);
      login_err.clone().err().unwrap()
    })?;

    let response = json!({
      "accessToken": access_token,
      "refreshToken": refresh_token,
    });

    Ok((
      StatusCode::OK,
      [(header::CONTENT_TYPE, "application/json")],
      response.to_string(),
    ))
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

pub(crate) async fn account_register(
  State(state): State<AppState>,
  Json(account_info): Json<AccountInfo>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let AppState { db, .. } = &state;

  let register_err = Err((StatusCode::BAD_REQUEST, "Registration failed"));

  let AccountInfo {
    username,
    email,
    phone,
    password,
    role,
  } = account_info;

  let user_exists = Users::find()
    .filter(
      Condition::any()
        .add(users::Column::Username.eq(&username))
        .add(users::Column::Email.eq(&email)),
    )
    .one(db)
    .await
    .map_err(|e| {
      log::error!("Error: {:?}", e);
      register_err.clone().err().unwrap()
    })?;

  if user_exists.is_some() {
    log::error!("User already exists");
    return register_err;
  }

  // Hash the password
  let argon2_config = argon2::Config::default();
  let mut rng = fastrand::Rng::new();
  let salt = std::iter::repeat_with(|| rng.u8(..))
    .take(16)
    .collect::<Vec<u8>>();

  let password = argon2::hash_raw(password.as_bytes(), &salt, &argon2_config).map_err(|e| {
    log::error!("Error hashing password: {:?}", e);
    register_err.clone().err().unwrap()
  })?;

  let new_user = users::ActiveModel {
    username: Set(username.clone()),
    email: Set(email.clone()),
    phone: Set(phone.clone()),
    salt: Set(salt.clone()),
    password: Set(password.clone()),
    role: Set(role.clone()),
    ..Default::default()
  };

  new_user.insert(db).await.map_err(|e| {
    log::error!("Error creating user: {:?}", e);
    register_err.clone().err().unwrap()
  })?;

  Ok(StatusCode::CREATED)
}

#[cfg(test)]
mod tests {}
