// this file is the used when deploying (see Dockerfile);
// its values will be overwriten by env variables (see env.js & env.template.js)
export const environment = {
  production: true,
  server_url: window["env"]["server_url"] || "", // ! automàtic a Helm --added empty string fallback to avoid error from Auth library when building
  websocket_url: window["env"]["websocket_url"], // ! automàtic a Helm
  iam_url: window["env"]["iam_url"] || "", // ! automàtic a Helm  // --added string fallback to avoid error from Auth library when building
  iam_realm_path: window["env"]["iam_realm_path"] || "", // ! automàtic a Helm --added string fallback to avoid error from Auth librarywhen building
  // iam_params: { CONSTANTS + iam_uri > iam_realm_path
    // iam_uri: window["env"]["iam_uri"] || "", // ara és iam_path
    // client_id: window["env"]["client_id"] || 'auth-client', //constant
    // scope: window["env"]["scope"] || 'openid profile email offline_access', //constant
    // grant_type: window["env"]["grant_type"] || 'code' //constant
  // },
  // server_uri: { CONSTANTS
    // execute_content_uri: window["env"]["execute_content_uri"] || '/api/v1/execute-content',
    // request_credential_uri: window["env"]["request_credential_uri"] || '/api/v1/openid-credential-offer',
    // verifiable_presentation_uri: window["env"]["verifiable_presentation_uri"] || '/api/v1/vp',
    // credentials_uri: window["env"]["credentials_uri"] || '/api/v1/credentials',
    // credentials_by_id_uri: window["env"]["credentials_by_id_uri"] || '/api/v1/credentials?credentialId=',
    // credentials_signed_by_id_uri: window["env"]["credentials_signed_by_id_uri"] || '/api/v1/request-signed-credential',
    // users_uri: window["env"]["users_uri"] || '/api/v1/users', // treure
    // ebsi_did_uri: window["env"]["ebsi_did_uri"] || '/api/v1/ebsi-did', // treure
    // cbor: window["env"]["cbor_uri"] || '/api/v1/vp/cbor' //constant
  // },
  // websocket_uri: window["env"]["websocket_uri"] || '/api/v1/pin', CONSTANTS
  logs_enabled: window["env"]["logs_enabled"] || false, //OPTIONAL WITH fallback
  // logs_email: window["env"]["logs_email"] || "domesupport@in2.es", CONSTANT
  customizations:{  
    colors:{ 
      primary: window["env"]["primary"] || '#00ADD3', //OPTIONAL WITH fallback
      primary_contrast: window["env"]["primary_contrast"] ||'#ffffff', //OPTIONAL WITH fallback
      secondary: window["env"]["secondary"] || '#50c8ff', //OPTIONAL WITH fallback
      secondary_contrast: window["env"]["secondary_contrast"] || '#000000' //OPTIONAL WITH fallback
    },
    logo_src: window["env"]["logo_src"], // ! automàtic a Helm
    favicon_src: window["env"]["favicon_src"] || "assets/icons/dome-favicon.png" //! automàtic a Helm
  }
};
