import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CameraSelectorPage } from './camera-selector.page';

describe('CameraSelectorPage', () => {
  let component: CameraSelectorPage;
  let fixture: ComponentFixture<CameraSelectorPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CameraSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
