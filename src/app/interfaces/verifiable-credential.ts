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
  credentialStatus: CredentialStatus;
  status: CredentialStatus; //TODO: Remove this field in the future
  credentialEncoded?: string;
}

export interface Issuer {
  id: string;
  organization?: string;
  country?: string;
  commonName?: string;
  serialNumber?: string;
}

export type CredentialSubject =
  | EmployeeCredentialSubject
  | LabelCredentialSubject
  | MachineCredentialSubject;


export interface LabelCredentialSubject {
  id: string;
  'gx:labelLevel': string;
  'gx:engineVersion': string;
  'gx:rulesVersion': string;
  'gx:compliantCredentials': CompliantCredentials[];
  'gx:validatedCriteria': string[];
}

export interface CompliantCredentials {
  id: string;
  type: string;
  'gx:digestSRI': string;
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
  employeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  domain?: string;
  ipAddress?: string;
}

export interface Mandator {
  id: string;
  organization: string;
  commonName: string;
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
