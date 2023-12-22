(function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
    window["env"]["wcaUrl"] = "http://localhost:8086";
    window["env"]["dataUrl"] = "http://localhost:8081";
    window["env"]["loginUrl"] = "http://localhost:9099/realms/wallet";
    window["env"]["registerUrl"] = "http://localhost:8085";
    window["env"]["execContUri"] = "/api/v2/execute-content";
    window["env"]["vPUri"] = "/api/v2/verifiable-presentation";
    window["env"]["credUri"] = "/api/v2/credentials";
    window["env"]["credIdUri"] = "/api/v2/credentials?credentialId=";
    window["env"]["userUri"] = "/api/v2/users";
    window["env"]["debug"] = true;
  })(this);