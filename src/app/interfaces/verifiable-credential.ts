export interface VerifiableCredential {
    credentialSubject: {
      mobile_phone: string;
      email: string;
      title: string;
      first_name: string;
      last_name: string;
      dateOfBirth: string;
      gender: string;
    };
    id: string;
    vcType: ['', ''];
  }