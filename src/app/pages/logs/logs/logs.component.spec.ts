import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogsComponent } from './logs.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LogsComponent,   IonicModule,
        RouterModule,
        TranslateModule.forRoot()
      ],
      providers:[{
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123' }), 
        },
      },]
    }).compileComponents();

    fixture = TestBed.createComponent(LogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
