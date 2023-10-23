export const environment = {
  production: true,
  base_url: 'http://localhost:8080',
  keycloakParams:{
    keycloak_url: 'http://localhost:8084/realms/WalletIdP/protocol/openid-connect/token',
    client_id: 'wallet-client',
    client_secret:'fV51P8jFBo8VnFKMMuP3imw3H3i5mNck',
    grant_type:'password'
  }
};
