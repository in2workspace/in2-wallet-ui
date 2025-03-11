export const environment = {
  production: true,
  server_url: window["env"]["server_url"], // s'ha de validar a Helm
  iam_url: window["env"]["iam_url"], // s'ha de validar a Helm
  websocket_url: window["env"]["websocket_url"], // s'ha de validar a Helm
  iam_params: {
    iam_uri: window["env"]["iam_uri"], // s'ha de validar a Helm
    // client_id: window["env"]["client_id"] || 'auth-client',
    // scope: window["env"]["scope"] || 'openid profile email offline_access',
    // grant_type: window["env"]["grant_type"] || 'code'
  },
  // server_uri: {
    // execute_content_uri: window["env"]["execute_content_uri"] || '/api/v1/execute-content',
    // request_credential_uri: window["env"]["request_credential_uri"] || '/api/v1/openid-credential-offer',
    // verifiable_presentation_uri: window["env"]["verifiable_presentation_uri"] || '/api/v1/verifiable-presentation',
    // credentials_uri: window["env"]["credentials_uri"] || '/api/v1/credentials',
    // credentials_by_id_uri: window["env"]["credentials_by_id_uri"] || '/api/v1/credentials?credentialId=',
    // credentials_signed_by_id_uri: window["env"]["credentials_signed_by_id_uri"] || '/api/v1/request-signed-credential',
    // users_uri: window["env"]["users_uri"] || '/api/v1/users', //!treure
    // ebsi_did_uri: window["env"]["ebsi_did_uri"] || '/api/v1/ebsi-did', //!treure
    // cbor: window["env"]["cbor_uri"] || '/api/v1/vp/cbor'
  // },
  // websocket_uri: window["env"]["websocket_uri"] || '/api/v1/pin',
  logs_enabled: window["env"]["logs_enabled"] || false,
  // logs_email: window["env"]["logs_email"] || "domesupport@in2.es",
  customizations:{
    colors:{ 
      primary:window["env"]["primary"] || '#00ADD3',
      primary_contrast: window["env"]["primary_contrast"] ||'#ffffff',
      secondary: window["env"]["secondary"] || '#50c8ff',
      secondary_contrast: window["env"]["secondary_contrast"] || '#000000'
    },
    logo_src: window["env"]["logo_src"], // s'ha de validar a Helm
    favicon_src: window["env"]["favicon_src"] || "assets/icon/favicon.png"
  }
};
