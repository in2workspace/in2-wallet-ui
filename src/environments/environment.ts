export const environment = {
  production: false,
  data_url: 'https://wallet-data:8080',
  wca_url: 'https://wallet-creation-application:8080',
  loginParams: {
    has_login: true,
    login_url: 'https://wallet-identity-provider:8080/realms/wallet',
    client_id: 'auth-client',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  registerParams: {
    has_register: true,
    register_url: 'https://wallet-user-registry:8080',
    client_id: '',
    client_secret: '',
    grant_type: ''
  },
};
