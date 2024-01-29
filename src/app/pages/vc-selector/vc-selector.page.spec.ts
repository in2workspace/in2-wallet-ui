import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VcSelectorPage } from './vc-selector.page';

describe('VcSelectorPage', () => {
  let component: VcSelectorPage;
  let fixture: ComponentFixture<VcSelectorPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VcSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
