use crate::{entities::fees_room_assignment, prelude::*};

#[derive(Debug, Clone, Serialize, Deserialize, Default, ToSchema)]
pub struct FeesRoomInfo {
  room_number: i32,
  fee_id: i32,
  fee_name: String,
  fee_amount: i64,
  due_date: DateTime,
  payment_date: Option<DateTime>,
  is_paid: bool,
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
