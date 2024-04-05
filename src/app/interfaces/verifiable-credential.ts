export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type?: string[];
  issuer: Issuer;
  issuanceDate: string;
  validFrom: string;
  expirationDate: string;
  credentialSubject: CredentialSubject;
}

export interface Issuer {
  id: string;
}

export interface CredentialSubject {
  mandate: Mandate;
}

export interface Mandate {
  id: string;
  mandator: Organization;
  mandatee: Person;
  power: Power[];
  life_span: LifeSpan;
}

export interface Organization {
  organizationIdentifier: string;
  commonName: string;
  emailAddress: string;
  serialNumber: string;
  organization: string;
  country: string;
}

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  mobile_phone: string;
}

export interface Power {
  id: string;
  tmf_type: string;
  tmf_domain: string[];
  tmf_function: string;
  tmf_action: string[];
}

export interface LifeSpan {
  start_date_time: string;
  end_date_time: string;
}