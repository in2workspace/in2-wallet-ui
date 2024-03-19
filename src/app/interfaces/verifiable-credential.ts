export interface VerifiableCredential {
    credentialSubject: {
      mobile_phone: string;
      email: string;
      title?: string;
      firstName: string;
      lastName: string;
      organizationalUnit:string;
      dateOfBirth: string;
      gender: string;
    };
    id: string;
    expirationDate:Date;
    vcType: ['', ''];
  }