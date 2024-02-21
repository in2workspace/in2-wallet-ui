export const environment = {
  production: false,
  server_url: 'http://localhost:8081',
  iam_url:'http://localhost:9099',
  websocket_url:'ws://localhost:8081',
  iam_params: {
    iam_uri:'/realms/wallet',
    client_id: 'auth-client',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  server_uri: {
    execute_content_uri: '/api/v2/execute-content',
    request_credential_uri: '/api/v2/request-credential',
    verifiable_presentation_uri: '/api/v2/verifiable-presentation',
    credentials_uri: '/api/v2/credentials',
    credentials_by_id_uri: '/api/v2/credentials?credentialId=',
    users_uri: '/api/v2/users',
    ebsi_did_uri: '/api/v2/ebsi-did',
  },
  websocket_uri:'/api/v2/pin'

};
