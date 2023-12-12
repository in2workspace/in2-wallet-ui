export const environment = {
  production: false,
  data_url: 'http://localhost:8086',
  wca_url: 'http://localhost:8081',
  loginParams: {
    has_login: true,
    login_url: 'http://localhost:9099/realms/wallet',
    client_id: 'auth-client',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  registerParams: {
    has_register: true,
    register_url: 'http://localhost:8085',
    client_id: '',
    client_secret: '',
    grant_type: ''
  },
};
