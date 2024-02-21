import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WalletService, VCReply } from './wallet.service';
import { environment } from 'src/environments/environment';
import { AuthModule, OidcSecurityService } from 'angular-auth-oidc-client';
import { Storage } from '@ionic/storage-angular';

describe('WalletService', () => {
  let walletService: WalletService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AuthModule.forRoot({config: {
        postLoginRoute: '/tabs/home',
        authority: environment.iam_url+environment.iam_params.iam_uri,
        redirectUrl: `${window.location.origin}/callback`,
        postLogoutRedirectUri: window.location.origin,
        clientId: environment.iam_params.client_id,
        scope: environment.iam_params.scope,
        responseType: environment.iam_params.grant_type,
        silentRenew: true,
        useRefreshToken: true,
        ignoreNonceAfterRefresh: true,
        triggerRefreshWhenIdTokenExpired: false,
        autoUserInfo: false,
        secureRoutes:[environment.server_url,environment.server_url]
      }})],
      providers: [WalletService, OidcSecurityService, Storage],
    });

    walletService = TestBed.inject(WalletService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([WalletService], (service: WalletService) => {
    expect(service).toBeTruthy();
  }));

  
  it('should execute content', () => {
    const mockUrl = 'mock-url';
    const mockResponse = 'mock-response';

    walletService.executeContent(mockUrl).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      environment.server_url + environment.server_uri.execute_content_uri
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ qr_content: mockUrl });

    req.flush(mockResponse);
  });

  it('should execute VC', () => {
    const mockVCReply: VCReply = {
      selectedVcList: [],
      state: 'mock-state',
      redirectUri: 'mock-redirect-uri',
    };
    const mockResponse = 'mock-response';

    walletService.executeVC(mockVCReply).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      environment.server_url + environment.server_uri.verifiable_presentation_uri
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockVCReply);

    req.flush(mockResponse);
  });

  // Add more test cases for other methods as needed
});
