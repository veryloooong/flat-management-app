use axum_extra::extract::Query;

use crate::{
  entities::{fee_recurrence, fees, fees_room_assignment},
  prelude::*,
};

#[derive(Debug, Clone, Serialize, Deserialize, Default, ToSchema)]
pub struct FeesRoomInfo {
  pub room_number: i32,
  pub fee_id: i32,
  pub fee_name: String,
  pub fee_amount: i64,
  pub due_date: DateTime,
  pub payment_date: Option<DateTime>,
  pub is_paid: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, ToSchema)]
pub struct PersonalHouseholdInfo {
  room_number: i32,
  tenant_id: i32,
  tenant_name: String,
  tenant_email: String,
  tenant_phone: String,
  fees: Vec<FeesRoomInfo>,
}

#[utoipa::path(
  get,
  path = "/household",
  description = "Lấy thông tin về hộ gia đình của người dùng. Nếu người dùng hợp lệ, trả về thông tin người dùng và phòng mà người dùng đang thuê dưới dạng JSON.",
  tag = tags::HOUSEHOLD,
  responses(
    (status = OK, description = "Household info"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = NOT_FOUND, description = "User not found"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn get_household_info(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<Json<PersonalHouseholdInfo>, StatusCode> {
  let jwt_access_secret = &state.jwt_access_secret;

  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err(StatusCode::UNAUTHORIZED);
    }
  };

  let user_id = claims.custom.id;

  // find user by id and the room that the user is renting
  let user = Users::find_by_id(user_id)
    .find_also_related(Rooms)
    .one(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

  let user = match user {
    Some(user) => user,
    None => {
      return Err(StatusCode::NOT_FOUND);
    }
  };

  if user.1.is_none() {
    return Err(StatusCode::NOT_FOUND);
  }

  // find fees that the user has to pay
  let fees = FeesRoomAssignment::find()
    .filter(fees_room_assignment::Column::RoomNumber.eq(user.1.as_ref().unwrap().room_number))
    .find_also_related(Fees)
    .all(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

  let fees = fees
    .into_iter()
    .map(|fee| FeesRoomInfo {
      room_number: fee.0.room_number,
      fee_id: fee.0.fee_id,
      fee_name: fee.1.as_ref().unwrap().name.clone(),
      fee_amount: fee.1.as_ref().unwrap().amount,
      due_date: fee.0.due_date,
      payment_date: fee.0.payment_date,
      is_paid: fee.0.is_paid,
    })
    .collect::<Vec<_>>();

  let household_info = PersonalHouseholdInfo {
    room_number: user.1.as_ref().unwrap().room_number,
    tenant_id: user.0.id,
    tenant_name: user.0.name.clone(),
    tenant_email: user.0.email.clone(),
    tenant_phone: user.0.phone.clone(),
    fees,
  };

  // return user and room info as one json object
  Ok(Json(household_info))
}

#[derive(Debug, Deserialize, utoipa::IntoParams)]
pub struct PayFeeParams {
  fee_id: i32,
}

#[utoipa::path(
  post,
  path = "/household/pay",
  description = "Thanh toán phí cho phòng mà người dùng đang thuê.",
  tag = tags::HOUSEHOLD,
  params(
    PayFeeParams
  ),
  responses(
    (status = OK, description = "Fee paid"),
    (status = UNAUTHORIZED, description = "Unauthorized"),
    (status = INTERNAL_SERVER_ERROR, description = "Server error"),
    (status = NOT_FOUND, description = "User or room not found"),
  ),
  security(
    ("Authorization" = [])
  )
)]
pub async fn pay_fee(
  State(state): State<AppState>,
  TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
  Query(PayFeeParams { fee_id }): Query<PayFeeParams>,
) -> Result<StatusCode, StatusCode> {
  let jwt_access_secret = &state.jwt_access_secret;
  let claims = match jwt_access_secret.verify_token::<AccessTokenClaims>(&bearer.token(), None) {
    Ok(claims) => claims,
    Err(_) => {
      return Err(StatusCode::UNAUTHORIZED);
    }
  };
  let user_id = claims.custom.id;
  let user = Users::find_by_id(user_id)
    .find_also_related(Rooms)
    .one(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
  let user = match user {
    Some(user) => user,
    None => {
      return Err(StatusCode::NOT_FOUND);
    }
  };
  if user.1.is_none() {
    return Err(StatusCode::NOT_FOUND);
  }

  // find fee by id
  let fee = FeesRoomAssignment::find()
    .filter(
      Condition::all()
        .add(fees_room_assignment::Column::FeeId.eq(fee_id))
        .add(fees_room_assignment::Column::RoomNumber.eq(user.1.as_ref().unwrap().room_number)),
    )
    .one(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
  let fee = match fee {
    Some(fee) => fee,
    None => {
      return Err(StatusCode::NOT_FOUND);
    }
  };
  if fee.is_paid {
    return Ok(StatusCode::OK);
  }
  let mut fee: fees_room_assignment::ActiveModel = fee.into();
  fee.is_paid = Set(true);
  fee.payment_date = Set(Some(chrono::Utc::now().naive_utc()));
  fee
    .save(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

  // check if the fee is in a recurrence chain and assign the next fee to the room
  let next_recurrence = match FeeRecurrence::find()
    .filter(fee_recurrence::Column::PreviousFeeId.eq(fee_id))
    .filter(fee_recurrence::Column::FeeId.ne(fee_id))
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
      room_number: Set(user.1.as_ref().unwrap().room_number),
      fee_id: Set(next_recurrence.fee_id),
      due_date: Set(next_recurrence.due_date),
      ..Default::default()
    };
    new_fee.save(&state.db).await.map_err(|e| {
      log::error!("Failed to save new fee assignment: {}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    })?;
    return Ok(StatusCode::OK);
  }

  // check if the fee is the last in a recurrence chain and create a new fee for the next due date
  let recurrence_entry = match FeeRecurrence::find()
    .filter(fee_recurrence::Column::FeeId.eq(fee_id))
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
    let old_fee = Fees::find_by_id(fee_id)
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
      room_number: Set(user.1.as_ref().unwrap().room_number),
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
      previous_fee_id: Set(fee_id),
      due_date: Set(new_due_date),
      ..Default::default()
    };
    new_recurrence.save(&state.db).await.map_err(|e| {
      log::error!("Failed to save new recurrence: {}", e);
      StatusCode::INTERNAL_SERVER_ERROR
    })?;
  }

  Ok(StatusCode::OK)
}
