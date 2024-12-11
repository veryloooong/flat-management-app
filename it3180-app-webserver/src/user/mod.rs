pub mod types;

use crate::prelude::*;

use crate::entities::{notifications, users};

use sea_orm::sea_query::Alias;
use sea_orm::{FromQueryResult, QuerySelect};
use tags::USER;

#[utoipa::path(
  get,
  path = "/info",
  description = "Lấy thông tin người dùng, yêu cầu request có token ở header. Trả về thông tin cơ bản của người dùng.",
  tag = USER,
  responses(
    (status = OK, description = "User info", body = BasicUserInfo),
    (status = BAD_REQUEST, description = "Invalid request", body = String),
    (status = NOT_FOUND, description = "User not found", body = String),
    (status = UNAUTHORIZED, description = "Invalid token", body = String),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub(crate) async fn get_user_info(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let jwt_access_secret = &state.jwt_access_secret;

  // use bearer token to get user info
  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err((
        StatusCode::UNAUTHORIZED,
        HeaderMap::new(),
        "invalid token".to_string(),
      ));
    }
  };

  let user_id = claims.custom.id;

  let user = match Users::find()
    .filter(users::Column::Id.eq(user_id))
    .into_partial_model::<BasicUserInfo>()
    .one(&state.db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "server error".to_string(),
      ));
    }
  };

  let user = match user {
    Some(user) => user,
    None => {
      return Err((
        StatusCode::NOT_FOUND,
        HeaderMap::new(),
        "user not found".to_string(),
      ));
    }
  };

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&user).unwrap(),
  ))
}

/// Updates the user info in the database. Takes a bearer token and the new user info.
#[utoipa::path(
  put,
  path = "/info",
  description = "Cập nhật thông tin người dùng, yêu cầu request có token ở header. Trả về thông báo cập nhật thành công hoặc thất bại.",
  tag = USER,
  responses(
    (status = OK, description = "User info updated"),
    (status = BAD_REQUEST, description = "Invalid request", body = String),
    (status = NOT_FOUND, description = "User not found", body = String),
    (status = UNAUTHORIZED, description = "Invalid token", body = String),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn update_user_info(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
  Json(info): Json<UpdateUserInfo>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let jwt_access_secret = &state.jwt_access_secret;
  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err((
        StatusCode::UNAUTHORIZED,
        HeaderMap::new(),
        "invalid token".to_string(),
      ));
    }
  };

  let user_id = claims.custom.id;

  let user = match Users::find()
    .filter(users::Column::Id.eq(user_id))
    .one(&state.db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "server error".to_string(),
      ));
    }
  };

  let user = match user {
    Some(user) => user,
    None => {
      return Err((
        StatusCode::NOT_FOUND,
        HeaderMap::new(),
        "user not found".to_string(),
      ));
    }
  };

  let mut user: users::ActiveModel = user.into();

  user.name = Set(info.name);
  user.email = Set(info.email);
  user.phone = Set(info.phone);

  match user.update(&state.db).await {
    Ok(_) => {}
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "server error".to_string(),
      ));
    }
  }

  Ok((StatusCode::OK, HeaderMap::new()))
}

/// Updates the user password in the database. Takes a bearer token and the old and new passwords.
/// The old password is used to verify the user before updating the password.
#[utoipa::path(
  put,
  path = "/password",
  description = "Cập nhật mật khẩu người dùng, yêu cầu request có token ở header. Kiểm tra người dùng hợp lệ và mật khẩu cũ.
  Trả về thông báo cập nhật thành công hoặc thất bại.",
  tag = USER,
  responses(
    (status = OK, description = "Password updated"),
    (status = BAD_REQUEST, description = "Invalid request", body = String),
    (status = NOT_FOUND, description = "User not found", body = String),
    (status = UNAUTHORIZED, description = "Invalid token", body = String),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn update_password(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
  Json(info): Json<UpdatePasswordInfo>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let jwt_access_secret = &state.jwt_access_secret;
  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err((
        StatusCode::UNAUTHORIZED,
        HeaderMap::new(),
        "invalid token".to_string(),
      ));
    }
  };

  let user_id = claims.custom.id;

  let user = match Users::find()
    .filter(users::Column::Id.eq(user_id))
    .one(&state.db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "server error".to_string(),
      ));
    }
  };

  let user = match user {
    Some(user) => user,
    None => {
      return Err((
        StatusCode::NOT_FOUND,
        HeaderMap::new(),
        "user not found".to_string(),
      ));
    }
  };

  let old_password_hash = &user.password;
  let salt = &user.salt;

  let old_password = info.old_password;
  let new_password = info.new_password;

  let argon2_config = argon2::Config::default();
  let matches = argon2::verify_raw(
    old_password.as_bytes(),
    &salt,
    &old_password_hash,
    &argon2_config,
  )
  .map_err(|e| {
    log::error!("Error: {:?}", e);
    (
      StatusCode::INTERNAL_SERVER_ERROR,
      HeaderMap::new(),
      "server error".to_string(),
    )
  })?;

  if !matches {
    return Err((
      StatusCode::BAD_REQUEST,
      HeaderMap::new(),
      "wrong password".to_string(),
    ));
  }

  let new_password_hash = argon2::hash_raw(new_password.as_bytes(), &salt, &argon2_config)
    .map_err(|e| {
      log::error!("Error: {:?}", e);
      (
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "server error".to_string(),
      )
    })?;

  let mut user: users::ActiveModel = user.into();
  user.password = Set(new_password_hash);

  match user.update(&state.db).await {
    Ok(_) => {}
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "server error".to_string(),
      ));
    }
  }

  Ok((StatusCode::OK, HeaderMap::new()))
}

/// Get the role of the user, given their token
#[utoipa::path(
  get,
  path = "/role",
  description = "Lấy quyền của người dùng, yêu cầu request có token ở header. Trả về quyền của người dùng dưới dạng JSON.",
  tag = USER,
  responses(
    (status = OK, description = "User role", body = String),
    (status = UNAUTHORIZED, description = "Invalid token", body = String),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_user_role(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<String, StatusCode> {
  let jwt_access_secret = &state.jwt_access_secret;
  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err(StatusCode::UNAUTHORIZED);
    }
  };

  let user_id = claims.custom.id;

  let user = match Users::find()
    .filter(users::Column::Id.eq(user_id))
    .one(&state.db)
    .await
  {
    Ok(user) => user,
    Err(_) => {
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  let user = match user {
    Some(user) => user,
    None => {
      return Err(StatusCode::NOT_FOUND);
    }
  };

  // :) hack to convert the enum to a &'static str then to a String wow this fucking sucks
  Ok(serde_json::json!(user.role).as_str().unwrap().to_string())
}

#[derive(Clone, Debug, serde::Deserialize, serde::Serialize, utoipa::ToSchema, FromQueryResult)]
pub struct NotificationInfo {
  pub id: i32,
  pub title: String,
  pub message: String,
  pub created_at: chrono::NaiveDateTime,
  pub from: String,
  pub to: String,
}

#[utoipa::path(
  get,
  path = "/notifications",
  description = "Lấy thông báo của người dùng, yêu cầu request có token ở header. Trả về thông báo dưới dạng JSON.",
  tag = USER,
  responses(
    (status = OK, description = "User notifications", body = Vec<notifications::Model>),
    (status = UNAUTHORIZED, description = "Invalid token", body = String),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_notifications(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<Json<Vec<NotificationInfo>>, StatusCode> {
  let jwt_access_secret = &state.jwt_access_secret;
  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err(StatusCode::UNAUTHORIZED);
    }
  };

  let user_id = claims.custom.id;

  let notifications = match Notifications::find()
    .filter(notifications::Column::ToUser.eq(user_id))
    .column_as(
      Expr::col((Alias::new("users_from"), users::Column::Name)),
      "from",
    )
    .column_as(
      Expr::col((Alias::new("users_to"), users::Column::Name)),
      "to",
    )
    .join_as(
      sea_orm::JoinType::InnerJoin,
      notifications::Relation::Users1.def(),
      Alias::new("users_to"),
    )
    .join_as(
      sea_orm::JoinType::InnerJoin,
      notifications::Relation::Users2.def(),
      Alias::new("users_from"),
    )
    .into_model::<NotificationInfo>()
    .all(&state.db)
    .await
  {
    Ok(notifications) => notifications,
    Err(e) => {
      log::error!("Error: {:#?}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  Ok(Json(notifications))
}
