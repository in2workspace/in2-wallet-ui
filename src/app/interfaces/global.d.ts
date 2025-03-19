// src/types/global.d.ts

interface Window {
    env: {
      server_url?: string;
      iam_url?: string;
      iam_realm_path: string;
      websocket_url?: string;
      client_id?: string;
      cbor_uri?: string;
      logs_enabled?: boolean;
      primary: string;
      primary_contrast: string;
      secondary: string;
      secondary_contrast: string;
      logo_src: string;
      favicon_src: string;
    };
  }
  