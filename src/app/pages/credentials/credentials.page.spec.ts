import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CredentialsPage } from './credentials.page';

describe('WalletPage', () => {
  let component: CredentialsPage;
  let fixture: ComponentFixture<CredentialsPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CredentialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
