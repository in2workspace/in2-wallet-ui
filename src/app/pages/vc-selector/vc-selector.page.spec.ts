import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VcSelectorPage } from './vc-selector.page';

describe('VcSelectorPage', () => {
  let component: VcSelectorPage;
  let fixture: ComponentFixture<VcSelectorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VcSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
