// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  data_url: 'http://localhost:8086',
  wca_url: 'http://localhost:8087',
  loginParams:{
    has_login: true,
    login_url: 'http://localhost:8084/realms/WalletIdP',
    client_id: 'wallet-client',
    client_secret:'fV51P8jFBo8VnFKMMuP3imw3H3i5mNck',
    grant_type:'code'
  },
  registerParams:{
    has_register: true,
    register_url: 'http://localhost:8085',
    client_id:'',
    client_secret:'',
    grant_type:''
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
