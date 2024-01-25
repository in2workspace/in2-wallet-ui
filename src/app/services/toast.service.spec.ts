import { TestBed } from '@angular/core/testing';

import { ToastServiceHandler } from './toast.service';

describe('ToastServiceHandler', () => {
  let service: ToastServiceHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastServiceHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
