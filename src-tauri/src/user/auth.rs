#[derive(serde::Serialize, serde::Deserialize)]
pub(crate) struct AuthenticationState {
  #[serde(skip_serializing)]
  access_token: Option<String>,
  #[serde(skip_serializing)]
  refresh_token: Option<String>,
}
