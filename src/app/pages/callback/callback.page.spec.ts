import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CallbackPage } from './callback.page';
import { AuthValidatorService } from '../../services/auth-validator.service';
import { IonicModule } from '@ionic/angular';

describe('CallbackPage', () => {
  let component: CallbackPage;
  let fixture: ComponentFixture<CallbackPage>;
  let mockAuthValidatorService: jest.Mocked<AuthValidatorService>;

  beforeEach(async () => {
    mockAuthValidatorService = {
      validateAuthParams: jest.fn(),
    } as unknown as jest.Mocked<AuthValidatorService>;

    await TestBed.configureTestingModule({
      imports: [IonicModule],
      declarations: [CallbackPage],
      providers: [
        { provide: AuthValidatorService, useValue: mockAuthValidatorService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CallbackPage);
    component = fixture.componentInstance;
  });

  it('should create the CallbackPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should call validateAuthParams on ngOnInit', () => {
    component.ngOnInit();
    expect(mockAuthValidatorService.validateAuthParams).toHaveBeenCalled();
  });
});
