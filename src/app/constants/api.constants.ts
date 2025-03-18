const apiV1Path = '/api/v1';

export const WEBSOCKET_URI = `${apiV1Path}/pin`;

export const SERVER_URI = Object.freeze({
  EXECUTE_CONTENT_URI: `${apiV1Path}/execute-content`,
  REQUEST_CREDENTIAL_URI: `${apiV1Path}/openid-credential-offer`,
  VERIFIABLE_PRESENTATION_URI: `${apiV1Path}/vp`,
  CREDENTIALS_URI: `${apiV1Path}/credentials`,
  CREDENTIALS_BY_ID_URI: `${apiV1Path}/credentials?credentialId=`,
  CREDENTIALS_SIGNED_BY_ID_URI: `${apiV1Path}/request-signed-credential`,
  CBOR: `${apiV1Path}/vp/cbor`
});