export const iam_params = {
    client_id: 'auth-client',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  } as const;

export const websocket_uri = '/api/v1/pin' as const;

export const server_uri = {
  execute_content_uri: '/api/v1/execute-content',
  request_credential_uri: '/api/v1/openid-credential-offer',
  verifiable_presentation_uri: '/api/v1/verifiable-presentation',
  credentials_uri: '/api/v1/credentials',
  credentials_by_id_uri: '/api/v1/credentials?credentialId=',
  credentials_signed_by_id_uri: '/api/v1/request-signed-credential',
  cbor: '/api/v1/vp/cbor'
} as const;

export const logs_email = "domesupport@in2.es" as const;