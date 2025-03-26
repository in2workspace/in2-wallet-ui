const V1Path = '/v1';

export const WEBSOCKET_PATH = `${V1Path}/pin`;

export const SERVER_PATH = Object.freeze({
  CBOR : `${V1Path}/vp/cbor`,
  CREDENTIALS: `${V1Path}/credentials`,
  CREDENTIALS_BY_ID: `${V1Path}/credentials?credentialId=`,
  CREDENTIALS_SIGNED_BY_ID: `${V1Path}/request-signed-credential`,
  EXECUTE_CONTENT: `${V1Path}/execute-content`,
  REQUEST_CREDENTIAL: `${V1Path}/openid-credential-offer`,
  VERIFIABLE_PRESENTATION: `${V1Path}/vp`,
});