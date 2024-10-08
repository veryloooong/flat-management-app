pub mod types;

use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::IntoResponse;
use sea_orm::prelude::*;
use types::BasicUserInfo;

use crate::entities::{prelude::*, users};
use crate::AppState;

pub(crate) async fn get_user_info(
  State(state): State<AppState>,
  Path(user_id): Path<i32>,
) -> Result<impl IntoResponse, impl IntoResponse> {
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

pub async fn modify_user_info(
  State(state): State<AppState>,
  Path(user_id): Path<i32>,
) -> Result<impl IntoResponse, impl IntoResponse> {
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

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&user).unwrap(),
  ))
}
