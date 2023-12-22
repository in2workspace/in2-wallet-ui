(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["wcaUrl"] = "${WCA_URL}";
  window["env"]["dataUrl"] = "${DATA_URL}";
  window["env"]["loginUrl"] = "${LOGIN_URL}";
  window["env"]["registerUrl"] = "${REGISTER_URL}";
  window["env"]["execContUri"] = "${EXECCONT_URI}";
  window["env"]["vPUri"] = "${VP_URL}";
  window["env"]["credUri"] = "${CRED_URI}";
  window["env"]["credIdUri"] = "${CREDID_URI}";
  window["env"]["userUri"] = "${USER_URI}";
  window["env"]["debug"] = "${DEBUG}";
})(this);