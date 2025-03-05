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
  life_span: LifeSpan;
  mandatee: Mandatee;
  mandator: Mandator;
  signer: Signer;
  power: Power[];
}

export interface LifeSpan {
  end_date_time: string;
  start_date_time: string;
}

export interface Mandatee {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
}

export interface OrganizationDetails {
  organizationIdentifier: string;
  organization: string;
  commonName: string;
  emailAddress: string;
  serialNumber: string;
  country: string;
}

export type Mandator = OrganizationDetails

export type Signer = OrganizationDetails

export interface Power {
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
