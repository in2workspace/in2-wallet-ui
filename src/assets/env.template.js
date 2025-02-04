(function (window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["server_url"] = "${WALLET_API_INTERNAL_DOMAIN}";
  window["env"]["websocket_url"] = "${WALLET_API_WEBSOCKET_EXTERNAL_DOMAIN}";
  window["env"]["websocket_uri"] = "${WALLET_API_WEBSOCKET_PATH}";
  window["env"]["iam_url"] = "${IAM_EXTERNAL_DOMAIN}";
  window["env"]["iam_uri"] = "${IAM_REALM_PATH}";
  window["env"]["client_id"] = "${IAM_CLIENT_ID}";
  window["env"]["scope"] = "${IAM_SCOPE}";
  window["env"]["grant_type"] = "${IAM_GRANT_TYPE}";
  window["env"]["execute_content_uri"] = "${WALLET_API_EXECUTE_CONTENT_PATH}";
  window["env"]["request_credential_uri"] = "${WALLET_API_REQUEST_CREDENTIAL_PATH}";
  window["env"]["verifiable_presentation_uri"] = "${WALLET_API_VERIFIABLE_PRESENTATION_PATH}";
  window["env"]["credentials_uri"] = "${WALLET_API_CREDENTIALS_PATH}";
  window["env"]["credentials_by_id_uri"] = "${WALLET_API_CREDENTIALS_BY_ID_PATH}";
  window["env"]["credentials_signed_by_id_uri"] = "${WALLET_API_REQUEST_SIGNED_CREDENTIAL_PATH}";
  window["env"]["users_uri"] = "${WALLET_API_USERS_PATH}";
  window["env"]["ebsi_did_uri"] = "${WALLET_API_EBSI_PATH}";
  window["env"]["cbor_uri"] = "${WALLET_API_CBOR_PATH}";
  window["env"]["logs_enabled"] = "${LOGS_ENABLED}";
  window["env"]["logs_email"] = "${LOGS_EMAIL}";
  window["env"]["primary"] = "${PRIMARY}";
  window["env"]["primary_contrast"]= "${PRIMARY_CONTRAST}";
  window["env"]["secondary"] = "${SECONDARY}";
  window["env"]["secondary_contrast"]= "${SECONDARY_CONTRAST}"
  window["env"]["logo_src"]= "${LOGO_SRC}"
})(this);
