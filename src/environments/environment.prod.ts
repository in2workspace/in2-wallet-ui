export const environment = {
  production: true,
  api_url: 'https://yourapiurl',
  data_url: 'https://yourdataurl',
  wca_url: 'https://yourwcaurl',
  crypto_url: 'https://yourcyptourl',
  loginParams:{
    has_login: true,
    login_url: 'https://yourloginurl',
    client_id: 'client',
    client_secret:'secret',
    scope: 'openid profile email offline_access',
    grant_type:'password'
  },
  registerParams:{
    has_register: true,
    register_url: '',
    client_id:'',
    client_secret:'',
    grant_type:''
  },
  walletUri: {
    execute_content_uri: '/api/v2/execute-content',
    verifiable_presentation_uri: '/api/v2/verifiable-presentation',
    credentials_uri: '/api/v2/credentials',
    credentials_by_id_uri: '/api/v2/credentials?credentialId=',
    users_uri: '/api/v2/users',
  }
};
