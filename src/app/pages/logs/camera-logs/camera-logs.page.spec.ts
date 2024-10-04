import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CameraLogsPage } from './camera-logs.page';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { Storage } from '@ionic/storage-angular';

describe('CameraLogsPage', () => {
  let component: CameraLogsPage;
  let fixture: ComponentFixture<CameraLogsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CameraLogsPage, IonicModule, DatePipe],
      providers:[CameraLogsService, Storage]
    }).compileComponents();

    fixture = TestBed.createComponent(CameraLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
