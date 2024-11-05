import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CredentialsFrameComponent } from './credentials-frame.component';

describe('CredentialsFrameComponent', () => {
  let component: CredentialsFrameComponent;
  let fixture: ComponentFixture<CredentialsFrameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CredentialsFrameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialsFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
