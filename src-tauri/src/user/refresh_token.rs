use super::types::LoginResponse;

pub async fn get_new_access_token(
  client: &reqwest::Client,
  server_url: &str,
  refresh_token: &str,
) -> Result<LoginResponse, String> {
  let response = client
    .post(&format!("{}/auth/refresh", server_url))
    .header("Content-Type", "application/json")
    .json(&serde_json::json!({ "refresh_token": refresh_token }))
    .send()
    .await
    .map_err(|e| format!("Failed to send request: {}", e))?
    .json::<LoginResponse>()
    .await
    .map_err(|e| format!("Failed to parse response: {}", e))?;

  Ok(response)
}
