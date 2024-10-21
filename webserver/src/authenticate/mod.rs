pub mod types;
pub mod validate_token;

use crate::prelude::*;

use crate::entities::users;

use axum::Json;
use serde_json::json;

const AUTH_TAG: &str = "auth";

/// Login command.
/// Takes a username and password and checks if they match a user in the database. Also checks if the user account is active.
#[utoipa::path(
  post,
  path = "/login",
  tag = AUTH_TAG,
  responses(
    (status = OK, description = "Login successful", body = TokenResponse),
    (status = BAD_REQUEST, description = "Invalid credentials", body = AccessTokenError),
  )
)]
pub(crate) async fn account_login(
  State(state): State<AppState>,
  Json(login_info): Json<LoginInfo>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let AppState {
    db,
    jwt_access_secret,
    jwt_refresh_secret,
  } = &state;
  let mut headers = HeaderMap::new();
  headers.append(header::CONTENT_TYPE, "application/json".parse().unwrap());

  let server_error = Err((
    StatusCode::INTERNAL_SERVER_ERROR,
    HeaderMap::new(),
    "server error".to_string(),
  ));

  // Get user info from db
  let user_info = match Users::find()
    .filter(users::Column::Username.eq(&login_info.username))
    .one(db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return server_error;
    }
  };

  let user_info = match user_info {
    Some(user) => user,
    None => {
      return Err((
        StatusCode::UNAUTHORIZED,
        headers,
        json!(AccessTokenError {
          error: "invalid_client".to_string(),
          error_description: "wrong creds".to_string(),
        })
        .to_string(),
      ));
    }
  };

  // Check if the user account is active
  if user_info.status != UserStatus::Active {
    log::error!("User account is not active");
    return Err((
      StatusCode::BAD_REQUEST,
      headers,
      json!(AccessTokenError {
        error: "unauthorized_client".to_string(),
        error_description: "account not active".to_string(),
      })
      .to_string(),
    ));
  }

  let salt = user_info.salt;
  let hashed_password = user_info.password;

  // Hash the password
  let argon2_config = argon2::Config::default();
  let password =
    argon2::hash_raw(login_info.password.as_bytes(), &salt, &argon2_config).map_err(|e| {
      log::error!("Error hashing password: {:?}", e);
      server_error.clone().err().unwrap()
    })?;

  if password != hashed_password {
    return Err((
      StatusCode::BAD_REQUEST,
      headers,
      json!(AccessTokenError {
        error: "invalid_client".to_string(),
        error_description: "wrong creds".to_string(),
      })
      .to_string(),
    ));
  }

  // Log
  log::info!(
    "login attempt by {} at {}",
    login_info.username,
    chrono::Utc::now()
  );

  // Create JWT
  let custom_claims = AccessTokenClaims {
    username: user_info.username.clone(),
    id: user_info.id,
    role: user_info.role.clone(),
  };
  let claims = Claims::with_custom_claims(custom_claims.clone(), Duration::from_mins(15));
  let access_token = jwt_access_secret.authenticate(claims).map_err(|e| {
    log::error!("Error creating access token: {:?}", e);
    server_error.clone().err().unwrap()
  })?;

  let custom_claims = RefreshTokenClaims {
    username: user_info.username.clone(),
    id: user_info.id,
    role: user_info.role.clone(),
    refresh_token_version: user_info.refresh_token_version,
  };
  let claims = Claims::with_custom_claims(custom_claims.clone(), Duration::from_hours(24));
  let refresh_token = jwt_refresh_secret.authenticate(claims).map_err(|e| {
    log::error!("Error creating refresh token: {:?}", e);
    server_error.clone().err().unwrap()
  })?;

  let response = TokenResponse {
    access_token,
    refresh_token,
    expires_in: 15 * 60,
    token_type: "Bearer".to_string(),
  };

  headers.append(header::CACHE_CONTROL, "no-store".parse().unwrap());

  Ok((StatusCode::OK, headers, json!(response).to_string()))
}

/// Register command.
/// Takes registration info as JSON and creates a new user in the database.
#[utoipa::path(
  post,
  path = "/register",
  tag = AUTH_TAG,
  responses(
    (status = CREATED, description = "Registration successful"),
    (status = BAD_REQUEST, description = "Registration failed"),
  )
)]
pub(crate) async fn account_register(
  State(state): State<AppState>,
  Json(register_info): Json<RegisterInfo>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let AppState { db, .. } = &state;

  let register_err = Err((StatusCode::BAD_REQUEST, "Registration failed"));

  let RegisterInfo {
    username,
    email,
    phone,
    password,
    role,
  } = register_info;

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
  let salt = (0..16).map(|_| rng.u8(..)).collect::<Vec<u8>>();

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

/// Logout command.
/// Takes a JWT token and increases the refresh token version of the user in the database.
/// This will invalidate all refresh tokens for the user.
#[utoipa::path(
  post,
  path = "/logout",
  tag = AUTH_TAG,
  responses(
    (status = OK, description = "Logout successful"),
    (status = UNAUTHORIZED, description = "Logout failed"),
  )
)]
pub(crate) async fn account_logout(
  State(state): State<AppState>,
  headers: HeaderMap,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let AppState {
    jwt_access_secret, ..
  } = &state;

  let logout_err = Err((StatusCode::UNAUTHORIZED, "Logout failed"));

  let auth_header = headers
    .get(header::AUTHORIZATION)
    .ok_or(logout_err.clone().err().unwrap())?;

  let token = auth_header.to_str().map_err(|e| {
    log::error!("Error parsing token: {:?}", e);
    logout_err.clone().err().unwrap()
  })?;

  let token = token.trim_start_matches("Bearer ");

  let claims = jwt_access_secret
    .verify_token::<AccessTokenClaims>(token, None)
    .map_err(|e| {
      log::error!("Error verifying token: {:?}", e);
      logout_err.clone().err().unwrap()
    })?;

  log::info!(
    "logout attempt by {} at {}",
    claims.custom.username,
    chrono::Utc::now()
  );

  // Find user in db
  let user = Users::find()
    .filter(users::Column::Username.eq(&claims.custom.username))
    .one(&state.db)
    .await
    .map_err(|e| {
      log::error!("Error: {:?}", e);
      logout_err.clone().err().unwrap()
    })?;

  let user = match user {
    Some(user) => user,
    None => {
      log::error!("User not found");
      return logout_err;
    }
  };

  // Check if the user account is active
  if user.status != UserStatus::Active {
    log::error!("User account is not active");
    return logout_err;
  }

  // Increase refresh token version
  let new_refresh_token_version = user.refresh_token_version + 1;
  let mut new_user: users::ActiveModel = user.into();
  new_user.refresh_token_version = Set(new_refresh_token_version);
  new_user.update(&state.db).await.map_err(|e| {
    log::error!("Error updating user: {:?}", e);
    logout_err.clone().err().unwrap()
  })?;

  Ok(StatusCode::OK)
}
