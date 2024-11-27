use crate::{
  entities::{fees, fees_room_assignment, rooms},
  prelude::*,
};

pub mod types {
  use crate::Fees;
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
    pub due_date: chrono::NaiveDateTime,
  }

  #[derive(Debug, Serialize, Deserialize, DerivePartialModel, FromQueryResult, ToSchema)]
  #[sea_orm(entity = "Fees")]
  pub struct DetailedFeeInfo {
    pub id: i32,
    pub name: String,
    pub amount: i64,
    pub is_required: bool,
    pub created_at: chrono::NaiveDateTime,
    pub due_date: chrono::NaiveDateTime,
  }

  #[derive(Debug, Clone, serde::Serialize, serde::Deserialize, ToSchema)]
  pub struct AddFeeInfo {
    pub name: String,
    pub amount: i64,
    pub is_required: bool,
    pub due_date: chrono::NaiveDateTime,
  }
}

use sea_orm::{sea_query::OnConflict, Order, QueryOrder};
use types::*;

// Chưa thấy kiểm tra authorization Long ơi
#[utoipa::path(
  get,
  path = "/fees",
  description = "Lấy danh sách tất cả các khoản phí, yêu cầu request có role là Manager. Trả về danh sách các khoản phí.",
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

  log::info!("Fees: {:?}", fees);

  Ok((
    StatusCode::OK,
    HeaderMap::new(),
    serde_json::to_string(&fees).unwrap(),
  ))
}

// Chưa thấy kiểm tra authorization Long ơi
#[utoipa::path(
  post,
  path = "/fees",
  description = "Thêm một khoản phí mới, yêu cầu request có role là Manager. Trả về status CREATED nếu thành công",
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

// Chưa thấy kiểm tra authorization Long ơi
#[utoipa::path(
  delete,
  path = "/fees/{id}",
  description = "Xóa một khoản phí, yêu cầu request có role là Manager. Kiểm tra khoản thu có tồn tại không, và trả về status NO_CONTENT nếu thành công",
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

// Chưa thấy kiểm tra authorization Long ơi
#[utoipa::path(
  get,
  path = "/fees/{id}",
  description = "Lấy thông tin một khoản phí theo ID, yêu cầu request có role là Manager. Kiểm tra khoản thu có tồn tại không, 
  trả về thông tin chi tiết của khoản phí",
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

// Chưa thấy kiểm tra authorization Long ơi

#[utoipa::path(
  put,
  path = "/fees/{id}",
  description = "Chỉnh sửa thông tin một khoản phí, yêu cầu request có role là Manager. Kiểm tra khoản thu có tồn tại không, 
  trả về status NO_CONTENT nếu thành công",
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

// Chưa thấy kiểm tra authorization Long ơi
#[utoipa::path(
  get,
  path = "/rooms",
  description = "Lấy danh sách tất cả các phòng, yêu cầu request có role là Manager. Trả về danh sách các phòng",
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

// Chưa thấy kiểm tra authorization Long ơi
#[utoipa::path(
  post,
  path = "/fees/{fee_id}/assign",
  description = "Gán một khoản phí cho một hoặc nhiều phòng, yêu cầu request có role là Manager. Kiểm tra khoản phí và phòng có tồn tại không
  trả về status OK nếu thành công",
  tag = tags::MANAGER,
  responses(
    (status = OK, description = "Fee assigned"),
    (status = NOT_FOUND, description = "Fee not found or room not found"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = FORBIDDEN, description = "Forbidden"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn assign_fee(
  State(state): State<AppState>,
  Path(fee_id): Path<i32>,
  Json(room_numbers): Json<Vec<i32>>,
) -> StatusCode {
  let fee = match Fees::find_by_id(fee_id).one(&state.db).await {
    Ok(fee) => fee,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return StatusCode::INTERNAL_SERVER_ERROR;
    }
  };

  if fee.is_none() {
    return StatusCode::NOT_FOUND;
  }

  // check if all rooms exist
  let rooms = match Rooms::find()
    .filter(rooms::Column::RoomNumber.is_in(room_numbers.clone()))
    .all(&state.db)
    .await
  {
    Ok(rooms) => rooms,
    Err(e) => {
      log::error!("Error: {:?}", e);
      return StatusCode::INTERNAL_SERVER_ERROR;
    }
  };

  if rooms.len() != room_numbers.len() {
    return StatusCode::NOT_FOUND;
  }

  // assign fee to rooms
  for room_number in room_numbers {
    let fee_room = fees_room_assignment::ActiveModel {
      fee_id: Set(fee_id),
      room_number: Set(room_number),
      due_date: Set(fee.as_ref().unwrap().due_date),
      ..Default::default()
    };

    match FeesRoomAssignment::insert(fee_room)
      .on_conflict(
        OnConflict::columns([
          fees_room_assignment::Column::RoomNumber,
          fees_room_assignment::Column::FeeId,
        ])
        .update_columns([fees_room_assignment::Column::FeeId])
        .to_owned(),
      )
      .exec(&state.db)
      .await
    {
      Ok(res) => {
        log::info!("Fee assigned: {:?}", res);
      }
      Err(e) => {
        log::error!("Error: {:?}", e);
        return StatusCode::INTERNAL_SERVER_ERROR;
      }
    }
  }

  StatusCode::OK
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize, ToSchema)]
pub struct DetailedRoomInfo {
  room_number: i32,
  tenant_id: i32,
  tenant_name: String,
  tenant_email: String,
  tenant_phone: String,
}

#[utoipa::path(
  get,
  path = "/rooms/detailed",
  description = "TODO Vũ làm",
  tag = tags::MANAGER,
  responses(
    (status = OK, description = "Rooms retrieved", body = Vec<DetailedRoomInfo>),
    (status = INTERNAL_SERVER_ERROR, description = "Server error", body = String),
    (status = UNAUTHORIZED, description = "Unauthorized", body = String),
    (status = FORBIDDEN, description = "Forbidden", body = String),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_rooms_detailed(
  State(state): State<AppState>,
) -> Result<impl IntoResponse, StatusCode> {
  let rooms = Rooms::find()
    .find_also_related(Users)
    .all(&state.db)
    .await
    .map_err(|e| {
      log::error!("Error: {:?}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    })?;

  let response = rooms
    .into_iter()
    .map(|room| {
      let room_info = room.0;
      let user_info = room.1.unwrap();

      let detailed_room = DetailedRoomInfo {
        room_number: room_info.room_number,
        tenant_id: user_info.id,
        tenant_name: user_info.name,
        tenant_email: user_info.email,
        tenant_phone: user_info.phone,
      };

      detailed_room
    })
    .collect::<Vec<_>>();

  Ok((StatusCode::OK, serde_json::to_string(&response).unwrap()))
}
