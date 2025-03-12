(function (window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["server_url"] = "${WALLET_API_INTERNAL_DOMAIN}";
  window["env"]["websocket_url"] = "${WALLET_API_WEBSOCKET_EXTERNAL_DOMAIN}";
  window["env"]["iam_url"] = "${IAM_EXTERNAL_DOMAIN}";
  window["env"]["iam_uri"] = "${IAM_REALM_PATH}";
  // window["env"]["cbor_uri"] = "${WALLET_API_CBOR_PATH}"; //todo
  window["env"]["logs_enabled"] = "${LOGS_ENABLED}";
  window["env"]["primary"] = "${PRIMARY}";
  window["env"]["primary_contrast"] = "${PRIMARY_CONTRAST}";
  window["env"]["secondary"] = "${SECONDARY}";
  window["env"]["secondary_contrast"] = "${SECONDARY_CONTRAST}";
  window["env"]["logo_src"] = "${LOGO_SRC}"
  window["env"]["favicon_src"] =  "${FAVICON_SRC}"
})(this);
