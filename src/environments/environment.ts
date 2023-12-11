// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  data_url: 'http://localhost:8086',
  wca_url: 'http://localhost:8087',
  loginParams: {
    has_login: true,
    login_url: 'http://localhost:8084/realms/WalletIdP',
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
