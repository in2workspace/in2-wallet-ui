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
      wallet_api_request_signed_credential_path?: string;
      users_uri?: string;
      ebsi_did_uri?: string;
      cbor_uri?: string;
      websocket_uri?: string;
      logs_enabled?: boolean;
      logs_email?: string;
      primary: string;
      primary_contrast: string;
      secondary: string;
      secondary_contrast: string;
    };
  }
  