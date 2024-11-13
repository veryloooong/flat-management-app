use crate::{entities::fees, prelude::*};

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

  // match Fees::delete()
  //   .filter(fees::Column::Id.eq(id))
  //   .exec(&state.db)
  //   .await
  // {
  //   Ok(res) => {
  //     log::info!("Fee removed: {:?}", res);
  //     StatusCode::NO_CONTENT
  //   }
  //   Err(e) => {
  //     log::error!("Error: {:?}", e);
  //     StatusCode::INTERNAL_SERVER_ERROR
  //   }
  // }
}
