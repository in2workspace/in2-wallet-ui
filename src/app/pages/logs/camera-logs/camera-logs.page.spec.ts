import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CameraLogsPage } from './camera-logs.page';

describe('ViewLogsComponent', () => {
  let component: CameraLogsPage;
  let fixture: ComponentFixture<CameraLogsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CameraLogsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
