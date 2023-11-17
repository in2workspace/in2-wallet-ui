// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://yourapiurl',
  data_url: 'http://yourdataurl',
  wca_url: 'http://yourwcaurl',
  crypto_url: 'http://yourcyptourl',
  loginParams:{
    has_login: true,
    login_url: 'http://yourloginurl',
    client_id: 'client',
    client_secret:'secret',
    grant_type:'password'
  },
  registerParams:{
    has_register: true,
    register_url: '',
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
