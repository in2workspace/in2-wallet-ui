// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  base_url: 'http://localhost:8080',
  keycloakParams:{
    keycloak_url: 'http://localhost:8084/realms/WalletIdP/protocol/openid-connect/token',
    client_id: 'wallet-client',
    client_secret:'fV51P8jFBo8VnFKMMuP3imw3H3i5mNck',
    grant_type:'password'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
