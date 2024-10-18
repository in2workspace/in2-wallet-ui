import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ToastServiceHandler } from '../services/toast.service';
import { HttpErrorInterceptor } from './error-handler.interceptor';

class MockToastServiceHandler {
  showErrorAlert(message: string) {
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

  it('should log and show a toast on a 404 Not Found response', () => {
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    httpClient.get('/test404').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('Resource not found message from backend');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Resource not found:', expect.any(String));
      }
    });

    const req = httpMock.expectOne('/test404');
    req.flush({message: 'Resource not found message from backend'}, { status: 404, statusText: 'Not Found' });
  });

  it('should show error toast on 422 Unprocessable Entity response', () => {
    const expectedMessage = 'Unprocessable Entity';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');

    httpClient.get('/test422').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith(expectedMessage);
      }
    });

    const req = httpMock.expectOne('/test422');
    req.flush({ message: expectedMessage }, { status: 422, statusText: 'Unprocessable Entity' });
  });

  it('should show error toast on 500 Internal Server Error response', () => {
    const expectedMessage = 'Internal Server Error';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');

    httpClient.get('/test500').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith(expectedMessage);
      }
    });

    const req = httpMock.expectOne('/test500');
    req.flush({ message: expectedMessage }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should log and show a toast on a 401 Unauthorized response', () => {
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    httpClient.get('/test401').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('Unauthorized error message from backend');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Unauthorized:', expect.any(String));
      }
    });

    const req = httpMock.expectOne('/test401');
    req.flush({message: 'Unauthorized error message from backend'}, { status: 401, statusText: 'Unauthorized' });
  });

  it('should log and show a toast on a generic HTTP error response', () => {
    const errorMessage = 'An error occurred';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    httpClient.get('/testError').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith(errorMessage);
        expect(consoleErrorSpy).toHaveBeenCalledWith('An HTTP error occurred:', expect.any(String));
      }
    });

    const req = httpMock.expectOne('/testError');
    req.flush({message: errorMessage}, { status: 500, statusText: 'Internal Server Error' });
  });
});
