import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WalletService } from './wallet.service';
import { environment } from 'src/environments/environment';
import { VerifiableCredential } from '../interfaces/verifiable-credential';

interface VCReply {
  selectedVcList: any[];
  state: string;
  redirectUri: string;
}

describe('WalletService', () => {
  let service: WalletService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WalletService]
    });
    service = TestBed.inject(WalletService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch VC in CBOR format', () => {
    const mockCredential: VerifiableCredential = {
      credentialSubject: {
        mobile_phone: '1234567890',
        email: 'test@example.com',
        title: 'Test Title',
        firstName: 'John',
        lastName: 'Doe',
        organizationalUnit: 'Testing',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      },
      id: 'test-credential-id',
      expirationDate: new Date('2025-01-01'),
      vcType: ['', '']
    };
    const mockResponse = 'mock-cbor-data';

    service.getVCinCBOR(mockCredential).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.server_url}/api/vp/cbor`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should fetch VC in JWT format', () => {
    const mockCredentialId = 'test-credential-id';
    const mockResponse = 'mock-jwt-data';

    service.getVCinJWT({ id: mockCredentialId } as VerifiableCredential).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.server_url}/api/credentials/id?credentialId=${mockCredentialId}&format=vc_jwt`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should request a new credential', () => {
    const mockCredentialOfferUri = 'test-offer-uri';
    const mockResponse = { message: 'Credential request successful' };

    service.requestCredential(mockCredentialOfferUri).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.server_url + environment.server_uri.request_credential_uri}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ credential_offer_uri: mockCredentialOfferUri });
    req.flush(mockResponse);
  });

  it('should execute Verifiable Credential and return response', () => {
    const mockVCReply: VCReply = {
      selectedVcList: [],
      state: 'test-state',
      redirectUri: 'test-redirect-uri'
    };
    const mockResponse = 'VC executed successfully';

    service.executeVC(mockVCReply).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.server_url + environment.server_uri.verifiable_presentation_uri}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockVCReply);
    req.flush(mockResponse);
  });

  it('should fetch all Verifiable Credentials', () => {
    const mockResponse: VerifiableCredential[] = [{
      credentialSubject: {
        mobile_phone: '0987654321',
        email: 'example@test.com',
        title: 'Example Title',
        firstName: 'Jane',
        lastName: 'Doe',
        organizationalUnit: 'Example Unit',
        dateOfBirth: '1985-02-15',
        gender: 'female'
      },
      id: 'example-credential-id',
      expirationDate: new Date('2030-01-01'),
      vcType: ['', '']
    }];

    service.getAllVCs().subscribe(credentials => {
      expect(credentials.length).toBeGreaterThan(0);
      expect(credentials).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.server_url + environment.server_uri.credentials_uri}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch a single Verifiable Credential by id', () => {
    const data = 'test-id';
    const mockResponse: VerifiableCredential = {
      credentialSubject: {
        mobile_phone: '1234567890',
        email: 'single@test.com',
        title: 'Single Test',
        firstName: 'Single',
        lastName: 'Credential',
        organizationalUnit: 'Test Unit',
        dateOfBirth: '1995-07-19',
        gender: 'other'
      },
      id: 'single-test-credential-id',
      expirationDate: new Date('2030-01-01'),
      vcType: ['', '']
    };

    service.getOne(data).subscribe(credential => {
      expect(credential).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.server_url}/api/vc/1/${data}/format?format=vc_json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should delete a Verifiable Credential by id', () => {
    const VC = 'test-vc-id';
    const mockResponse = 'VC deleted successfully';

    service.deleteVC(VC).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.server_url + environment.server_uri.credentials_by_id_uri + VC}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
