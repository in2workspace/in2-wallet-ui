import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePage } from './home.page';
import { BehaviorSubject } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
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
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate based on queryParams on init', async () => {
    const navigateSpy = spyOn(router, 'navigate');

    (route.queryParams as BehaviorSubject<any>).next({ credential_offer_uri: 'newUri' });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/tabs/credentials'], { queryParams: { credentialOfferUri: 'newUri' } });
  });


  it('startScan should navigate with specific queryParams', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.startScan();
    expect(navigateSpy).toHaveBeenCalledWith(['/tabs/credentials/'], { queryParams: { toggleScan: true, from: 'home', show_qr: true } });
  });
});
