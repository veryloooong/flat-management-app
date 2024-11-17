use crate::{entities::fees, prelude::*};

pub mod types {
  use crate::Fees;
  use chrono::NaiveDate as Date;
  use sea_orm::{DerivePartialModel, FromQueryResult};
  use serde::{Deserialize, Serialize};
  use utoipa::ToSchema;

  #[derive(Debug, Serialize, Deserialize, DerivePartialModel, FromQueryResult, ToSchema)]
  #[sea_orm(entity = "Fees")]
  pub struct DetailedFeeInfo {
    pub id: i32,
    pub name: String,
    pub amount: i64,
    pub is_required: bool,
    pub created_at: Date,
    pub collected_at: Date,
  }
}

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
  // TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
  Json(fee_info): Json<AddFeeInfo>,
) -> StatusCode {
  let new_fee = fees::ActiveModel {
    amount: Set(fee_info.amount),
    name: Set(fee_info.name),
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
