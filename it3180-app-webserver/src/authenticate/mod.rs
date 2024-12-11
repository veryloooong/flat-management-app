pub mod recover_password;
pub mod validate_token;

use crate::prelude::*;

use crate::entities::{rooms, users};

use axum::Json;
use serde_json::json;

use crate::router::tags::AUTH;

/// Login command.
#[utoipa::path(
  post,
  path = "/login",
  description = "Đăng nhập vào hệ thống với tên đăng nhập và mật khẩu. Đăng nhập thành công nếu tài khoản có trong cơ sở dữ liệu và đã được kích hoạt.
  Trả về access token và refresh token.",
  tag = AUTH,
  responses(
    (status = OK, description = "Login successful", body = TokenResponse),
    (status = UNAUTHORIZED, description = "Invalid credentials", body = AccessTokenError),
    (status = BAD_REQUEST, description = "Invalid credentials", body = AccessTokenError),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
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

  let server_error = (
    StatusCode::INTERNAL_SERVER_ERROR,
    HeaderMap::new(),
    "server error".to_string(),
  );

  // Get user info from db
  let user_info = match Users::find()
    .filter(users::Column::Username.eq(&login_info.username))
    .one(db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err(server_error.clone());
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
      server_error.clone()
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

  // expiry times
  let access_token_expiry = Duration::from_hours(1);
  let refresh_token_expiry = Duration::from_hours(24);

  // Create JWT
  let custom_claims = AccessTokenClaims {
    username: user_info.username.clone(),
    id: user_info.id,
    role: user_info.role.clone(),
  };
  let claims = Claims::with_custom_claims(custom_claims.clone(), access_token_expiry);
  let access_token = jwt_access_secret.authenticate(claims).map_err(|e| {
    log::error!("Error creating access token: {:?}", e);
    server_error.clone()
  })?;

  let custom_claims = RefreshTokenClaims {
    username: user_info.username.clone(),
    id: user_info.id,
    role: user_info.role.clone(),
    refresh_token_version: user_info.refresh_token_version,
  };
  let claims = Claims::with_custom_claims(custom_claims.clone(), refresh_token_expiry);
  let refresh_token = jwt_refresh_secret.authenticate(claims).map_err(|e| {
    log::error!("Error creating refresh token: {:?}", e);
    server_error
  })?;

  let response = TokenResponse {
    access_token,
    refresh_token,
    expires_in: access_token_expiry.as_secs() as i64,
    token_type: "Bearer".to_string(),
  };

  headers.append(header::CACHE_CONTROL, "no-store".parse().unwrap());

  Ok((StatusCode::OK, headers, json!(response).to_string()))
}

/// Register command.
#[utoipa::path(
  post,
  path = "/register",
  description = "Đăng ký tài khoản mới với thông tin cần thiết (đưa vào dưới dạng JSON). Trả về trạng thái CREATED và thêm người dùng mới vào database
  nếu đăng ký thành công.",
  tag = AUTH,
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
    name,
    username,
    email,
    phone,
    password,
    role,
    room_id,
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
    name: Set(name.clone()),
    username: Set(username.clone()),
    email: Set(email.clone()),
    phone: Set(phone.clone()),
    salt: Set(salt.clone()),
    password: Set(password.clone()),
    role: Set(role.clone()),
    ..Default::default()
  };
  let res = Users::insert(new_user).exec(db).await.map_err(|e| {
    log::error!("Error: {:?}", e);
    register_err.clone().err().unwrap()
  })?;

  let user_id = res.last_insert_id;
  // add new room to db and assign to user
  if room_id.is_some() && role == UserRole::Tenant {
    let room_id = room_id.unwrap();

    // check if room exists
    let room = Rooms::find()
      .filter(rooms::Column::RoomNumber.eq(room_id))
      .one(db)
      .await
      .map_err(|e| {
        log::error!("Error: {:?}", e);
        register_err.clone().err().unwrap()
      })?;
    if room.is_some() {
      return register_err.clone();
    }

    // create new room
    let new_room = rooms::ActiveModel {
      room_number: Set(room_id.clone()),
      tenant_id: Set(user_id),
      ..Default::default()
    };
    new_room.insert(db).await.map_err(|e| {
      log::error!("Error: {:?}", e);
      register_err.clone().err().unwrap()
    })?;
  }

  Ok(StatusCode::CREATED)
}

/// Logout command.
#[utoipa::path(
  post,
  path = "/logout",
  description = "Đăng xuất khỏi hệ thống. Nhận JWT token, sau đó tìm thông tin và kiểm tra trạng thái kích hoạt của người dùng trong database. 
  Tăng phiên bản refresh token của người dùng trong cơ sở dữ liệu. Điều này sẽ vô hiệu hóa tất cả các refresh token của người dùng. 
  Trả về mã trạng thái OK nếu đăng xuất thành công.",
  tag = AUTH,
  responses(
    (status = OK, description = "Logout successful"),
    (status = UNAUTHORIZED, description = "Logout failed"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub(crate) async fn account_logout(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let AppState {
    jwt_access_secret, ..
  } = &state;

  let logout_err = (StatusCode::UNAUTHORIZED, "Logout failed");

  let token = bearer.token();

  let claims = jwt_access_secret
    .verify_token::<AccessTokenClaims>(token, None)
    .map_err(|e| {
      log::error!("Error verifying token: {:?}", e);
      logout_err.clone()
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
      logout_err.clone()
    })?;

  let user = match user {
    Some(user) => user,
    None => {
      log::error!("User not found");
      return Err(logout_err.clone());
    }
  };

  // Check if the user account is active
  if user.status != UserStatus::Active {
    log::error!("User account is not active");
    return Err(logout_err.clone());
  }

  // Increase refresh token version
  let new_refresh_token_version = user.refresh_token_version + 1;
  let mut new_user: users::ActiveModel = user.into();
  new_user.refresh_token_version = Set(new_refresh_token_version);
  new_user.update(&state.db).await.map_err(|e| {
    log::error!("Error updating user: {:?}", e);
    logout_err.clone()
  })?;

  Ok(StatusCode::OK)
}
