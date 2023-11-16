// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  base_url: 'https://app-wallet-api-ms-iep-dev.azurewebsites.net',
  loginParams:{
    has_login: true,
    login_url: 'https://app-cross-keycloak-ms-iep-dev.azurewebsites.net/',
    client_id: 'oidc4vci-client',
    client_secret:'vxuLBYhEJ0atp1AZPjwKh5hzaZMOqd5y',
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
