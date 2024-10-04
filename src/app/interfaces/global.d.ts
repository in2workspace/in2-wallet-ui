// src/types/global.d.ts

interface Window {
    env: {
      server_url?: string;
      iam_url?: string;
      websocket_url?: string;
      iam_uri?: string;
      client_id?: string;
      scope?: string;
      grant_type?: string;
      execute_content_uri?: string;
      request_credential_uri?: string;
      verifiable_presentation_uri?: string;
      credentials_uri?: string;
      credentials_by_id_uri?: string;
      credentials_signed_by_id_uri?: string;
      users_uri?: string;
      ebsi_did_uri?: string;
      cbor_uri?: string;
      websocket_uri?: string;
      logs_enabled?: boolean
    };
  }
  