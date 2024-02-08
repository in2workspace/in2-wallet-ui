export const environment = {
  production: false,
  data_url: window["env"]["wcaUrl"] || 'http://localhost:8086',
  wca_url: window["env"]["dataUrl"] || 'http://localhost:8081',
  loginParams: {
    has_login: true,
    login_url: window["env"]["loginUrl"] || 'http://localhost:9099/realms/wallet',
    client_id: window["env"]["client_id"] || 'auth-client',
    scope: window["env"]["scope"] || 'openid profile email offline_access',
    grant_type: window["env"]["grant_type"] || 'code'
  },
  registerParams: {
    has_register: true,
    register_url: window["env"]["registerUrl"] || 'http://localhost:8085',
    client_id: '',
    client_secret: '',
    grant_type: ''
  },
  walletUri: {
    execute_content_uri: window["env"]["execContUri"] || '/api/v2/execute-content',
    verifiable_presentation_uri: window["env"]["vPUri"] || '/api/v2/verifiable-presentation',
    credentials_uri: window["env"]["credUri"] || '/api/v2/credentials',
    credentials_by_id_uri: window["env"]["credIdUri"] || '/api/v2/credentials?credentialId=',
    users_uri: window["env"]["userUri"] || '/api/v2/users',
  }
};
