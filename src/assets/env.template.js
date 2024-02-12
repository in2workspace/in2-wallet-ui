(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["wcaUrl"] = "${WCA_URL}";
  window["env"]["dataUrl"] = "${DATA_URL}";
  window["env"]["loginUrl"] = "${LOGIN_URL}";
  window["env"]["execContUri"] = "${EXECCONT_URI}";
  window["env"]["vPUri"] = "${VP_URL}";
  window["env"]["credUri"] = "${CRED_URI}";
  window["env"]["credIdUri"] = "${CREDID_URI}";
  window["env"]["userUri"] = "${USER_URI}";
  window["env"]["debug"] = "${DEBUG}";
  window["env"]["client_id"] = "${CLIENT_ID}";
  window["env"]["scope"] = "${SCOPE}";
  window["env"]["grant_type"] = "${GRANT_TYPE}";
  window["env"]["websocketUrl"] = "${WEBSOCKET_URL}";
  window["env"]["websocketUri"] = "${WEBSOCKET_URI}";
})(this);