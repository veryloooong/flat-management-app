//! Contains all the dependencies and imports that are used in the entire project.

// Importing the necessary dependencies
pub use axum::extract::{Request, State};
pub use axum::http::{header, HeaderMap, StatusCode};
pub use axum::middleware::Next;
pub use axum::response::IntoResponse;
pub use axum::Json;
pub use axum_extra::headers::authorization::Bearer;
pub use axum_extra::headers::Authorization;
pub use axum_extra::TypedHeader;
pub use jwt_simple::prelude::*;
pub use sea_orm::{prelude::*, Condition, Database, Set};
pub use serde_json::json;
pub use utoipa::ToSchema;

// Importing the necessary modules
pub use crate::entities::{prelude::*, sea_orm_active_enums::*};
pub use crate::router::tags;
pub use crate::types::*;
pub use crate::user::types::*;
pub(crate) use crate::AppState;
