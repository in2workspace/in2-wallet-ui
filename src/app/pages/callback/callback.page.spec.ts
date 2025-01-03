import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CallbackPage } from './callback.page';
import { AuthValidatorService } from '../../services/auth-validator.service';
import { TranslateService } from '@ngx-translate/core';

describe('CallbackPage', () => {
  let component: CallbackPage;
  let fixture: ComponentFixture<CallbackPage>;
  let mockAuthValidatorService: jest.Mocked<AuthValidatorService>;
  let mockTranslateService: jest.Mocked<TranslateService>;

  beforeEach(async () => {
    mockAuthValidatorService = {
      validateAuthParams: jest.fn(),
    } as unknown as jest.Mocked<AuthValidatorService>;

    mockTranslateService = {
      get: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      use: jest.fn(),
      setDefaultLang: jest.fn(),
    } as unknown as jest.Mocked<TranslateService>;

    await TestBed.configureTestingModule({
      imports: [CallbackPage],
      providers: [
        { provide: AuthValidatorService, useValue: mockAuthValidatorService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CallbackPage);
    component = fixture.componentInstance;
  });

  it('should create the CallbackPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should call validateAuthParams on ngOnInit', () => {
    component.ngAfterViewInit();
    expect(mockAuthValidatorService.validateAuthParams).toHaveBeenCalled();
  });
});
