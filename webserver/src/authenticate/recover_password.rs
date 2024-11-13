use crate::{entities::users, prelude::*};

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

  let user_search_result = match Users::find()
    .filter(users::Column::Username.eq(&recovery_info.username))
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

  if let Some(email) = &recovery_info.email {
    if email != &user_info.email {
      return Err((StatusCode::BAD_REQUEST, ""));
    }
  }

  // Send email with password recovery link
  // TODO

  Ok(StatusCode::OK)
}
