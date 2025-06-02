export const IAM_PARAMS = Object.freeze({
    CLIENT_ID: 'auth-client',
    SCOPE: 'openid profile email offline_access',
    GRANT_TYPE: 'code'
  });

export const IAM_POST_LOGOUT_URI = `${window.location.origin}`;
export const IAM_POST_LOGIN_URI = '/tabs/home';
export const IAM_REDIRECT_URI = `${window.location.origin}/callback`;