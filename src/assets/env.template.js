(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["server_url"] = "${SERVER_URL}";
  window["env"]["iam_url"] = "${IAM_URL}";
  window["env"]["websocket_url"] = "${WEBSOCKET_URL}";
  window["env"]["iam_uri"] = "${IAM_URI}";
  window["env"]["client_id"] = "${CLIENT_ID}";
  window["env"]["scope"] = "${SCOPE}";
  window["env"]["grant_type"] = "${GRANT_TYPE}";
  window["env"]["execute_content_uri"] = "${EXECCONT_URI}";
  window["env"]["request_credential_uri"] = "${REQCRED_URI}";
  window["env"]["verifiable_presentation_uri"] = "${VP_URI}";
  window["env"]["credentials_uri"] = "${CRED_URI}";
  window["env"]["credentials_by_id_uri"] = "${CREDID_URI}";
  window["env"]["users_uri"] = "${USER_URI}";
  window["env"]["ebsi_did_uri"] = "${EBSI_URI}";
  window["env"]["cbor_uri"] = "${CBOR_URI}";
  window["env"]["websocket_uri"] = "${WEBSOCKET_URI}";
})(this);