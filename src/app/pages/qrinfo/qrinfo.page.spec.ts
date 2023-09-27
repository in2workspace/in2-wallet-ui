import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QRInfoPage } from './qrinfo.page';

describe('QRInfoPage', () => {
  let component: QRInfoPage;
  let fixture: ComponentFixture<QRInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QRInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
