export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type?: string[];
  issuer: Issuer;
  issuanceDate: string;
  validFrom: string;
  expirationDate: string;
  validUntil: string;
  credentialSubject: CredentialSubject;
  available_formats?: string[];
  status: CredentialStatus;
}

export interface Issuer {
  id: string;
}

export interface CredentialSubject {
  mandate: Mandate;
}

export interface Mandate {
  id: string;
  mandatee: Mandatee;
  mandator: Mandator;
  power: Power[];
}

export interface Mandatee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
}

export interface Mandator {
  organizationIdentifier: string;
  organization: string;
  commonName: string;
  emailAddress: string;
  serialNumber: string;
  country: string;
}

export interface Power {
  id: string;
  action: string | string[];
  domain: string;
  function: string;
  type: string;
}

export enum CredentialStatus {
  VALID = 'VALID',
  ISSUED = 'ISSUED',
  REVOKED = 'REVOKED'
}
