import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogsPage } from './logs.page';

describe('LogsPageComponent', () => {
  let component: LogsPage;
  let fixture: ComponentFixture<LogsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LogsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
