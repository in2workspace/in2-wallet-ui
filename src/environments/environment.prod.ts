export const environment = {
  production: true,
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
