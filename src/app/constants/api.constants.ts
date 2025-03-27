const apiV1Path = '/v1';

export const WEBSOCKET_PATH = `${apiV1Path}/pin`;

export const SERVER_PATH = Object.freeze({
  CBOR : `${apiV1Path}/vp/cbor`,
  CREDENTIALS: `${apiV1Path}/credentials`,
  CREDENTIALS_BY_ID: `${apiV1Path}/credentials?credentialId=`,
  CREDENTIALS_SIGNED_BY_ID: `${apiV1Path}/request-signed-credential`,
  EXECUTE_CONTENT: `${apiV1Path}/execute-content`,
  REQUEST_CREDENTIAL: `${apiV1Path}/openid-credential-offer`,
  VERIFIABLE_PRESENTATION: `${apiV1Path}/vp`,
});