use crate::{
  entities::{password_recovery_requests, users},
  prelude::*,
};

/// Recover password, either by email or phone
#[utoipa::path(
  post,
  path = "/recover",
  tag = tags::AUTH,
  responses(
    (status = OK, description = "Password recovery successful"),
    (status = NOT_FOUND, description = "User not found"),
    (status = BAD_REQUEST, description = "Invalid credentials"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = NOT_IMPLEMENTED, description = "Method not implemented"),
  )
)]
pub async fn recover_password(
  State(state): State<AppState>,
  Json(recovery_info): Json<RecoverPasswordInfo>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  if recovery_info.method == RecoverPasswordMethod::Phone {
    return Err((StatusCode::NOT_IMPLEMENTED, "currently not implemented"));
  }

  let user_email = match &recovery_info.email {
    Some(email) => email,
    None => {
      return Err((StatusCode::NOT_FOUND, ""));
    }
  };

  let user_search_result = match Users::find()
    .filter(users::Column::Email.eq(user_email))
    .one(&state.db)
    .await
  {
    Ok(user) => user,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((StatusCode::INTERNAL_SERVER_ERROR, ""));
    }
  };

  let user_info = match user_search_result {
    Some(user) => user,
    None => {
      return Err((StatusCode::NOT_FOUND, ""));
    }
  };

  // Make a password recovery token and store it in the database
  let token = Uuid::new_v4();
  let token_expiry = chrono::Utc::now() + chrono::Duration::hours(1);

  let recovery_request = password_recovery_requests::ActiveModel {
    id: Set(token),
    user_id: Set(user_info.id),
    recovery_time: Set(token_expiry.naive_utc()),
    ..Default::default()
  };

  match recovery_request.insert(&state.db).await {
    Ok(res) => {
      let token = res.id;

      // TODO: Send email with password recovery link
    }
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((StatusCode::INTERNAL_SERVER_ERROR, ""));
    }
  }

  // Send email with password recovery link
  // TODO

  Ok(StatusCode::OK)
}
