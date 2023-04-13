import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorPage } from './language-selector.page';

describe('LanguageSelectorPage', () => {
  let component: LanguageSelectorPage;
  let fixture: ComponentFixture<LanguageSelectorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LanguageSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
