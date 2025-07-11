import { TestBed } from '@angular/core/testing';
import { CallbackPage } from './callback.page';

describe('CallbackPage', () => {
  let component: CallbackPage;

  beforeEach(() => {
    jest.useFakeTimers(); 

    TestBed.configureTestingModule({
      providers: [
        CallbackPage
      ],
    });

    component = TestBed.inject(CallbackPage);
  });

  it('should create the CallbackPage component', () => {
    expect(component).toBeTruthy();
  });
});
