use crate::{
  entities::{fee_recurrence, fees, fees_room_assignment, transaction_logs, transactions},
  prelude::*,
};

use regex::Regex;
use sea_orm::IntoActiveModel;

/// The payload sent by the webhook
/// Example in JSON:
/// {
///   "id": 3,
///   "gateway": "Vietcombank",
///   "transactionDate": "2023-03-25 00:00:01",
///   "accountNumber": "0123499999",
///   "code": null,
///   "content": "TSF3",
///   "transferType": "in",
///   "transferAmount": 2277000,
///   "accumulated": 19077000,
///   "subAccount": null,
///   "referenceCode": "MBVCB.3278907687",
///   "description": ""
/// }
#[derive(serde::Serialize, serde::Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WebhookPayload {
  pub id: i32,
  pub gateway: String,
  pub transaction_date: String,
  pub account_number: String,
  pub sub_account: Option<String>,
  pub transfer_amount: i64,
  pub accumulated: i64,
  pub code: Option<String>,
  pub content: String,
  pub reference_code: Option<String>,
  pub description: Option<String>,
}

#[utoipa::path(
  post,
  path = "/webhook/payment",
  summary = "Webhook for payment",
  description = "Webhook for payment"
)]
pub async fn webhook_payment_handler(
  headers: HeaderMap,
  State(state): State<AppState>,
  Json(payload): Json<WebhookPayload>,
) -> Result<impl IntoResponse, StatusCode> {
  // header format: "Authorization":"Apikey <api_key>"
  // parse api key
  let auth = headers.get("Authorization").and_then(|v| v.to_str().ok());
  match auth {
    Some(auth) if auth.starts_with("Apikey ") => {
      let api_key = auth.trim_start_matches("Apikey ");
      if api_key != state.payment_api_key {
        return Err(StatusCode::UNAUTHORIZED);
      }
    }
    _ => return Err(StatusCode::UNAUTHORIZED),
  }

  // insert transaction log
  let transaction_date =
    chrono::NaiveDateTime::parse_from_str(&payload.transaction_date, "%Y-%m-%d %H:%M:%S")
      .unwrap_or(chrono::Utc::now().naive_utc());
  let transaction_log = transaction_logs::ActiveModel {
    id: Set(payload.id),
    gateway: Set(payload.gateway),
    transaction_date: Set(transaction_date),
    account_number: Set(payload.account_number),
    sub_account: Set(payload.sub_account),
    transfer_amount: Set(payload.transfer_amount),
    accumulated: Set(payload.accumulated),
    code: Set(payload.code),
    content: Set(payload.content),
    reference_code: Set(payload.reference_code),
    description: Set(payload.description),
    ..Default::default()
  };
  let transaction_log = match transaction_log.insert(&state.db).await {
    Ok(transaction_log) => transaction_log,
    Err(e) => {
      log::error!("Failed to insert transaction log: {:?}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  let content = transaction_log.content;
  let re = Regex::new(r"FLATAPP(?<code>[0-9]+)").unwrap();
  let code = re
    .captures(&content)
    .and_then(|c| c.name("code").map(|m| m.as_str().parse::<i32>().ok()))
    .flatten();
  let code = match code {
    Some(code) => code,
    None => {
      log::error!("Failed to parse code from content: {:?}", content);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  // get corresponding fee room assignment and fee
  let fee_room_assignment = match FeesRoomAssignment::find_by_id(code)
    .find_also_related(Fees)
    .one(&state.db)
    .await
  {
    Ok(fee_room_assignment) => fee_room_assignment,
    Err(e) => {
      log::error!("Failed to find fee room assignment: {:?}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };
  let fee_room_assignment = match fee_room_assignment {
    Some(fee_room_assignment) => fee_room_assignment,
    None => {
      log::error!("Fee room assignment not found: {:?}", code);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };
  let (assignment, fee) = fee_room_assignment;
  let fee = match fee {
    Some(fee) => fee,
    None => {
      log::error!("Fee not found: {:?}", code);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  // check if payment is valid
  if assignment.is_paid {
    log::info!("Fee room assignment already paid: {:?}", code);
    return Err(StatusCode::BAD_REQUEST);
  }
  if fee.amount != payload.transfer_amount {
    log::error!(
      "Amount mismatch: expected {}, got {}",
      fee.amount,
      payload.transfer_amount
    );
    return Err(StatusCode::BAD_REQUEST);
  }

  // update assignment
  let mut assignment = assignment.into_active_model();
  assignment.is_paid = Set(true);
  assignment.payment_date = Set(Some(transaction_date));
  let assignment = match assignment.save(&state.db).await {
    Ok(assignment) => assignment,
    Err(e) => {
      log::error!("Failed to update assignment: {:?}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };

  let new_transaction = transactions::ActiveModel {
    amount: Set(payload.transfer_amount),
    created_at: Set(transaction_date),
    assignment_id: Set(code),
    ..Default::default()
  };
  new_transaction.save(&state.db).await.map_err(|e| {
    log::error!("Failed to insert transaction: {:?}", e);
    StatusCode::INTERNAL_SERVER_ERROR
  })?;

  // check if the fee is in a recurrence chain and assign the next fee to the room
  let next_recurrence = match FeeRecurrence::find()
    .filter(fee_recurrence::Column::PreviousFeeId.eq(fee.id))
    .filter(fee_recurrence::Column::FeeId.ne(fee.id))
    .one(&state.db)
    .await
  {
    Ok(entry) => entry,
    Err(e) => {
      log::error!("Failed to find next recurrence: {}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };
  if let Some(next_recurrence) = next_recurrence {
    // assign the next fee to the current room
    let new_fee = fees_room_assignment::ActiveModel {
      room_number: assignment.room_number.clone(),
      fee_id: Set(next_recurrence.fee_id),
      due_date: Set(next_recurrence.due_date),
      ..Default::default()
    };
    new_fee.save(&state.db).await.map_err(|e| {
      log::error!("Failed to save new fee assignment: {}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    })?;
    return Ok((
      StatusCode::CREATED,
      Json(json!({
        "success": true
      })),
    ));
  }

  // check if the fee is the last in a recurrence chain and create a new fee for the next due date
  let recurrence_entry = match FeeRecurrence::find()
    .filter(fee_recurrence::Column::FeeId.eq(fee.id))
    .one(&state.db)
    .await
  {
    Ok(entry) => entry,
    Err(e) => {
      log::error!("Failed to find recurrence: {}", e);
      return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }
  };
  if recurrence_entry.is_some() {
    // find the fee that is being paid
    let old_fee = Fees::find_by_id(fee.id)
      .one(&state.db)
      .await
      .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let old_fee = match old_fee {
      Some(fee) => fee,
      None => {
        return Err(StatusCode::NOT_FOUND);
      }
    };
    // create a new fee for the next due date
    let new_due_date = old_fee.due_date
      + match { old_fee.recurrence_type.as_ref().unwrap() } {
        RecurrenceType::Weekly => chrono::Duration::days(7),
        RecurrenceType::Monthly => chrono::Duration::days(30),
        RecurrenceType::Yearly => chrono::Duration::days(365),
      };
    let new_fee = fees::ActiveModel {
      name: Set(old_fee.name.clone()),
      amount: Set(old_fee.amount),
      is_required: Set(old_fee.is_required),
      created_at: Set(chrono::Utc::now().naive_utc()),
      is_recurring: Set(true),
      due_date: Set(new_due_date),
      recurrence_type: Set(old_fee.recurrence_type.clone()),
      ..Default::default()
    };
    let new_fee = new_fee.save(&state.db).await.map_err(|e| {
      log::error!("Failed to save new fee: {}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    })?;
    let new_fee_id = new_fee.id.unwrap();
    // assign the new fee to the room
    let new_assignment = fees_room_assignment::ActiveModel {
      room_number: assignment.room_number.clone(),
      fee_id: Set(new_fee_id),
      due_date: Set(new_due_date),
      ..Default::default()
    };
    new_assignment.save(&state.db).await.map_err(|e| {
      log::error!("Failed to save new fee assignment: {}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    })?;
    // create a new recurrence chain
    let new_recurrence = fee_recurrence::ActiveModel {
      fee_id: Set(new_fee_id),
      previous_fee_id: Set(fee.id),
      due_date: Set(new_due_date),
      ..Default::default()
    };
    new_recurrence.save(&state.db).await.map_err(|e| {
      log::error!("Failed to save new recurrence: {}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    })?;
  }

  Ok((
    StatusCode::CREATED,
    Json(json!({
      "success": true
    })),
  ))
}

#[utoipa::path(
  get,
  path = "/webhook/payment/{id}",
  summary = "Check payment status",
  description = "Check payment status"
)]
pub async fn check_payment(
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
  State(state): State<AppState>,
  Path(id): Path<i32>,
) -> StatusCode {
  if let Err(e) = &state
    .jwt_access_secret
    .verify_token::<AccessTokenClaims>(&bearer.token(), None)
  {
    log::error!("Failed to verify token: {}", e);
    return StatusCode::UNAUTHORIZED;
  };
  let assignment = match FeesRoomAssignment::find_by_id(id).one(&state.db).await {
    Ok(assignment) => assignment,
    Err(e) => {
      log::error!("Failed to find fee room assignment: {}", e);
      return StatusCode::INTERNAL_SERVER_ERROR;
    }
  };
  let assignment = match assignment {
    Some(assignment) => assignment,
    None => {
      log::error!("Fee room assignment not found: {}", id);
      return StatusCode::NOT_FOUND;
    }
  };

  if assignment.is_paid {
    StatusCode::OK
  } else {
    StatusCode::NOT_FOUND
  }
}
