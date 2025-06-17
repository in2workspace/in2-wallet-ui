export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type?: string[];
  name?: string;
  description?: string;
  issuer: Issuer;
  validFrom: string;
  validUntil: string;
  credentialSubject: CredentialSubject;
  status: CredentialStatus;
}

export interface Issuer {
  id: string;
}

export type CredentialSubject =
  | EmployeeCredentialSubject
  | LabelCredentialSubject
  | MachineCredentialSubject;


export interface LabelCredentialSubject {
  id: string;
  gx_labelLevel: string;
}

export interface MachineCredentialSubject {
  mandate: Mandate;
}

export interface EmployeeCredentialSubject  {
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
  domain: string;
  ipAddress: string;
}

export interface Mandator {
  organizationIdentifier?: string;
  organization: string;
  commonName: string;
  emailAddress?: string;
  serialNumber: string;
  country: string;
}

export interface Power {
  id: string;
  type: string;
  domain: string;
  function: string;
  action: string | string[];
}

//TODO: REVISAR NEW FORMAT
export enum CredentialStatus {
  VALID = 'VALID',
  ISSUED = 'ISSUED',
  REVOKED = 'REVOKED'
}
