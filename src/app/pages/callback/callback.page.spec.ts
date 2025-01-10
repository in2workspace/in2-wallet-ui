import { TestBed } from '@angular/core/testing';
import { CallbackPage } from './callback.page';
import { Router } from '@angular/router';

describe('CallbackPage', () => {
  let component: CallbackPage;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    jest.useFakeTimers(); 

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        CallbackPage,
        { provide: Router, useValue: mockRouter },
      ],
    });

    component = TestBed.inject(CallbackPage);
  });

  it('should create the CallbackPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /tabs/home after 2 seconds on ngOnInit', () => {
    component.ngAfterViewInit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    jest.advanceTimersByTime(2000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/home']);
  });
});
