import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredentialOfferPage } from './credential-offer.page';

describe('CredentialOfferPage', () => {
  let component: CredentialOfferPage;
  let fixture: ComponentFixture<CredentialOfferPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CredentialOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
