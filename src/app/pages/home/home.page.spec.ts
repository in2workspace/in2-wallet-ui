import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePage } from './home.page';
import { BehaviorSubject } from 'rxjs';

class MockRouter {
  public navigate = (route:string|string[], opt?:{})=>'';
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let route: ActivatedRoute;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: new BehaviorSubject({ credential_offer_uri: 'someUri' })
          }
        }, {provide:Router, useValue:mockRouter}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });
  it('should call deleteVC when keydown event with key "Enter" and action "startScan"', fakeAsync(() => {
    spyOn(component, 'startScan');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.handleButtonKeydown(event);
    tick();
    expect(component.startScan).toHaveBeenCalled();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate based on queryParams on init', async () => {
    const navigateSpy = spyOn(mockRouter, 'navigate');

    (route.queryParams as BehaviorSubject<any>).next({ credential_offer_uri: 'newUri' });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/tabs/credentials'], { queryParams: { credentialOfferUri: 'newUri' } });
  });

  it('startScan should navigate with specific queryParams', async () => {
    const navigateSpy = spyOn(mockRouter, 'navigate');
    await component.startScan();
    expect(navigateSpy).toHaveBeenCalledWith(['/tabs/credentials/'], { queryParams: { toggleScan: true, from: 'home', show_qr: true } });
  });

  // it('startScan should navigate with specific queryParams', fakeAsync(() => {
  //   const navigateSpy = spyOn(mockRouter, 'navigate');
  //   component.startScan();
  //   tick();
  //   expect(navigateSpy).toHaveBeenCalledWith(['/tabs/credentials/'], { queryParams: { toggleScan: true, from: 'home', show_qr: true } });
  // }));
  
  

});
