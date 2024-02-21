export const environment = {
  production: true,
  server_url:window["env"]["serverUrl"] || 'http://localhost:8081',
  iam_url: window["env"]["iamUrl"] || 'http://localhost:9099',
  websocket_url: window["env"]["websocketUrl"] || 'ws://localhost:8081',
  iam_params: {
    iam_uri: window["env"]["iamUri"] || '/realms/wallet',
    client_id: window["env"]["client_id"] ||  'auth-client',
    scope: window["env"]["scope"] || 'openid profile email offline_access',
    grant_type: window["env"]["grant_type"] || 'code'
  },
  server_uri: {
    execute_content_uri: window["env"]["execContUri"] || '/api/v2/execute-content',
    request_credential_uri: '/api/v2/request-credential',
    verifiable_presentation_uri: window["env"]["vPUri"] || '/api/v2/verifiable-presentation',
    credentials_uri: window["env"]["credUri"] || '/api/v2/credentials',
    credentials_by_id_uri: window["env"]["credIdUri"] || '/api/v2/credentials?credentialId=',
    users_uri: window["env"]["userUri"] || '/api/v2/users',
    ebsi_did_uri: window["env"]["ebsiDid"] || '/api/v2/ebsi-did'
  },
  websocket_uri: window["env"]["websocketUri"] || '/api/v2/pin'
};
