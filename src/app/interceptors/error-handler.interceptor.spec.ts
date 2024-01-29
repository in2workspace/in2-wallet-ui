import { TestBed } from '@angular/core/testing';

import { HttpErrorInterceptor } from './error-handler.interceptor';

describe('HttpErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpErrorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
