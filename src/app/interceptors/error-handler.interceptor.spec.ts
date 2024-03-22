import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ToastServiceHandler } from '../services/toast.service';
import { HttpErrorInterceptor } from './error-handler.interceptor';

class MockToastServiceHandler {
  showErrorAlert(code: string, message: string) {
  }
}

describe('HttpErrorInterceptor with HttpClient', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let mockToastServiceHandler: MockToastServiceHandler;

  beforeEach(() => {
    mockToastServiceHandler = new MockToastServiceHandler();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
        {
          provide: ToastServiceHandler,
          useValue: mockToastServiceHandler
        }
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show error toast on 422 Unprocessable Entity response', () => {
    const spy = spyOn(mockToastServiceHandler, 'showErrorAlert');

    httpClient.get('/test422').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('home.unsucces', 'Http failure response for /test422: 422 Unprocessable Entity');
      }
    });

    const req = httpMock.expectOne('/test422');
    req.flush('Unprocessable Entity', { status: 422, statusText: 'Unprocessable Entity' });
  });

  it('should show error toast on 500 Internal Server Error response', () => {
    const spy = spyOn(mockToastServiceHandler, 'showErrorAlert');

    httpClient.get('/test500').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('home.unsucces', 'Http failure response for /test500: 500 Internal Server Error');
      }
    });

    const req = httpMock.expectOne('/test500');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should show error toast on network error (status 0)', () => {
    const spy = spyOn(mockToastServiceHandler, 'showErrorAlert');

    httpClient.get('/testNetworkError').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('home.unsucces', 'Http failure response for /testNetworkError: 0 ');
      }
    });

    const req = httpMock.expectOne('/testNetworkError');
    req.error(new ErrorEvent('Network error'), { status: 0 });
  });
});

