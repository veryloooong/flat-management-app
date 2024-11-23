use crate::{
  entities::{fees, rooms, users},
  prelude::*,
};

pub mod types {
  use crate::Fees;
  use chrono::NaiveDate as Date;
  use sea_orm::{DerivePartialModel, FromQueryResult};
  use serde::{Deserialize, Serialize};
  use utoipa::ToSchema;

  #[derive(
    Debug,
    Clone,
    serde::Serialize,
    serde::Deserialize,
    ToSchema,
    DerivePartialModel,
    FromQueryResult,
  )]
  #[serde(rename_all = "snake_case")]
  #[sea_orm(entity = "Fees")]
  pub struct FeesInfo {
    pub id: i32,
    pub name: String,
    pub amount: i64,
    pub due_date: Date,
  }

  #[derive(Debug, Serialize, Deserialize, DerivePartialModel, FromQueryResult, ToSchema)]
  #[sea_orm(entity = "Fees")]
  pub struct DetailedFeeInfo {
    pub id: i32,
    pub name: String,
    pub amount: i64,
    pub is_required: bool,
    pub created_at: Date,
    pub due_date: Date,
  }

  #[derive(Debug, Clone, serde::Serialize, serde::Deserialize, ToSchema)]
  pub struct AddFeeInfo {
    pub name: String,
    pub amount: i64,
    pub is_required: bool,
    pub due_date: Date,
  }
}

use sea_orm::{FromQueryResult, JoinType, Order, QueryOrder, QuerySelect};
use types::*;

#[utoipa::path(
  get,
  path = "/fees",
  summary = "Get all fees",
  tag = tags::MANAGER,
  responses(
    (status = OK, description = "Fees retrieved", body = Vec<FeesInfo>),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
    (status = UNAUTHORIZED, description = "Unauthorized", body = String),
    (status = FORBIDDEN, description = "Forbidden", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_fees(
  State(state): State<AppState>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let fees = match Fees::find()
    .order_by(fees::Column::DueDate, Order::Asc)
    .into_partial_model::<FeesInfo>()
    .all(&state.db)
    .await
  {
    Ok(fees) => fees,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "".to_string(),
      ));
    }
  };

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&fees).unwrap(),
  ))
}

#[utoipa::path(
  post,
  path = "/fees",
  summary = "Add a new fee",
  tag = tags::MANAGER,
  responses(
    (status = CREATED, description = "Fee added"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = FORBIDDEN, description = "Forbidden"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn add_fee(
  State(state): State<AppState>,
  Json(fee_info): Json<AddFeeInfo>,
) -> StatusCode {
  let new_fee = fees::ActiveModel {
    amount: Set(fee_info.amount),
    name: Set(fee_info.name),
    due_date: Set(fee_info.due_date),
    is_required: Set(fee_info.is_required),
    ..Default::default()
  };

  match Fees::insert(new_fee).exec(&state.db).await {
    Ok(res) => {
      log::info!("Fee added: {:?}", res);
      StatusCode::CREATED
    }
    Err(e) => {
      log::error!("Error: {:?}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    }
  }
}

#[utoipa::path(
  delete,
  path = "/fees/{id}",
  summary = "Remove a fee",
  tag = tags::MANAGER,
  responses(
    (status = NO_CONTENT, description = "Fee removed"),
    (status = NOT_FOUND, description = "Fee not found"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = FORBIDDEN, description = "Forbidden"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn remove_fee(State(state): State<AppState>, Path(id): Path<i32>) -> StatusCode {
  let res = Fees::delete_by_id(id).exec(&state.db).await;

  let Ok(res) = res else {
    log::error!("Error: {:?}", res);
    return StatusCode::INTERNAL_SERVER_ERROR;
  };

  match res.rows_affected {
    0 => {
      log::info!("Fee not found");
      return StatusCode::NOT_FOUND;
    }
    _ => {
      log::info!("Fee removed: {:?}", res);
      return StatusCode::NO_CONTENT;
    }
  }
}

#[utoipa::path(
  get,
  path = "/fees/{id}",
  summary = "Get a fee",
  tag = tags::MANAGER,
  responses(
    (status = OK, description = "Fee retrieved", body = types::DetailedFeeInfo),
    (status = NOT_FOUND, description = "Fee not found"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = FORBIDDEN, description = "Forbidden"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_one_fee(
  State(state): State<AppState>,
  Path(id): Path<i32>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let fee = match Fees::find_by_id(id)
    .into_partial_model::<types::DetailedFeeInfo>()
    .one(&state.db)
    .await
  {
    Ok(fee) => fee,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        HeaderMap::new(),
        "".to_string(),
      ));
    }
  };

  let fee = match fee {
    Some(fee) => fee,
    None => {
      return Ok((StatusCode::NOT_FOUND, HeaderMap::new(), "".to_string()));
    }
  };

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&fee).unwrap(),
  ))
}

#[utoipa::path(
  put,
  path = "/fees/{id}",
  summary = "Edit a fee",
  tag = tags::MANAGER,
  responses(
    (status = NO_CONTENT, description = "Fee updated"),
    (status = NOT_FOUND, description = "Fee not found"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = FORBIDDEN, description = "Forbidden"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn edit_fee_info(
  State(state): State<AppState>,
  Path(id): Path<i32>,
  Json(fee_info): Json<AddFeeInfo>,
) -> StatusCode {
  let fee = match Fees::find_by_id(id).one(&state.db).await {
    Ok(fee) => fee,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return StatusCode::INTERNAL_SERVER_ERROR;
    }
  };

  let fee = match fee {
    Some(fee) => fee,
    None => {
      return StatusCode::NOT_FOUND;
    }
  };

  let fee = fees::ActiveModel {
    amount: Set(fee_info.amount),
    name: Set(fee_info.name),
    due_date: Set(fee_info.due_date),
    is_required: Set(fee_info.is_required),
    ..fee.into()
  };

  match Fees::update(fee).exec(&state.db).await {
    Ok(res) => {
      log::info!("Fee updated: {:?}", res);
      StatusCode::NO_CONTENT
    }
    Err(e) => {
      log::error!("Error: {:?}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    }
  }
}

#[utoipa::path(
  get,
  path = "/rooms",
  summary = "Get all rooms",
  tag = tags::MANAGER,
  responses(
    (status = OK, description = "Rooms retrieved", body = Vec<i32>),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
    (status = UNAUTHORIZED, description = "Unauthorized", body = String),
    (status = FORBIDDEN, description = "Forbidden", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_rooms(
  State(state): State<AppState>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let rooms = match Rooms::find().all(&state.db).await {
    Ok(rooms) => rooms,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  // make an array of room numbers
  let rooms = rooms
    .into_iter()
    .map(|room| room.room_number)
    .collect::<Vec<_>>();

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&rooms).unwrap(),
  ))
}

pub async fn assign_fee() {
  todo!()
}
