import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ToastServiceHandler } from '../services/toast.service';
import { HttpErrorInterceptor } from './error-handler.interceptor';
import { SERVER_URI } from '../constants/api.constants';

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

    httpClient.get('/test404').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('Resource not found message from backend');
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

    httpClient.get('/test401').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('Unauthorized error message from backend');
      }
    });

    const req = httpMock.expectOne('/test401');
    req.flush({message: 'Unauthorized error message from backend'}, { status: 401, statusText: 'Unauthorized' });
  });

  it('should log and show a toast on a generic HTTP error response', () => {
    const errorMessage = 'An error occurred';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');

    httpClient.get('/testError').subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne('/testError');
    req.flush({message: errorMessage}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('it should print the correct message if a request to process the QR is made', ()=>{
    const errorMessage = 'There was a problem processing the QR. It might be invalid or already have been used';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');

    httpClient.get('/' + SERVER_URI.EXECUTE_CONTENT_URI).subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('errorMessage');
      }
    });

    const req = httpMock.expectOne('/' + SERVER_URI.EXECUTE_CONTENT_URI);
    req.flush({message: 'Random error message'}, { status: 500, statusText: 'AnyText' });
  });

  it('should handle errors silently for verifiable presentation URI', () => {
    const testUrl = SERVER_URI.VERIFIABLE_PRESENTATION_URI;
    const spy = jest.spyOn(console, 'error');

    httpClient.get(testUrl).subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith('Handled silently:', 'Test error message');
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(
      { message: 'Test error message' },
      { status: 400, statusText: 'Bad Request' }
    );
  });


  it('should show a toast with "PIN expired" on a 408 Request Timeout response', () => {
    const expectedMessage = 'PIN expired';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');
  
    httpClient.get('/' + SERVER_URI.REQUEST_CREDENTIAL_URI).subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith(expectedMessage);
      },
    });
  
    const req = httpMock.expectOne('/' + SERVER_URI.REQUEST_CREDENTIAL_URI);
    req.flush({ message: 'Request Timeout' }, { status: 408, statusText: 'Request Timeout' });
  });
  
  it('should show a toast with "PIN expired" on a 504 Gateway Timeout response', () => {
    const expectedMessage = 'PIN expired';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');
  
    httpClient.get('/' + SERVER_URI.REQUEST_CREDENTIAL_URI).subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith(expectedMessage);
      },
    });
  
    const req = httpMock.expectOne('/' + SERVER_URI.REQUEST_CREDENTIAL_URI);
    req.flush({ message: 'Gateway Timeout' }, { status: 504, statusText: 'Gateway Timeout' });
  });

  it('should show a toast with "PIN expired" on a 408 Request Timeout response for execute_content_uri', () => {
    const expectedMessage = 'PIN expired';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');
  
    httpClient.get('/' + SERVER_URI.EXECUTE_CONTENT_URI).subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith(expectedMessage);
      },
    });
  
    const req = httpMock.expectOne('/' + SERVER_URI.EXECUTE_CONTENT_URI);
    req.flush({ message: 'Request Timeout' }, { status: 408, statusText: 'Request Timeout' });
  });
  
  it('should show a toast with "PIN expired" on a 504 Gateway Timeout response for execute_content_uri', () => {
    const expectedMessage = 'PIN expired';
    const spy = jest.spyOn(mockToastServiceHandler, 'showErrorAlert');
  
    httpClient.get('/' + SERVER_URI.EXECUTE_CONTENT_URI).subscribe({
      error: (error) => {
        expect(spy).toHaveBeenCalledWith(expectedMessage);
      },
    });
  
    const req = httpMock.expectOne('/' + SERVER_URI.EXECUTE_CONTENT_URI);
    req.flush({ message: 'Gateway Timeout' }, { status: 504, statusText: 'Gateway Timeout' });
  });
  
  
});
