import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import routes from './tabs.routes';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { logsEnabledGuard } from '../../guards/logs-enabled.guard';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {

    const mockAutoLoginPartialRoutesGuard = {
      canActivateChild: jest.fn().mockReturnValue(true),
    };

    const mockLogsEnabledGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: AutoLoginPartialRoutesGuard, useValue: mockAutoLoginPartialRoutesGuard },
        { provide: logsEnabledGuard, useValue: mockLogsEnabledGuard },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  it('should navigate to HomePage for the default path', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/home');
  });

  it('should navigate to CredentialsPage for /credentials', async () => {
    await router.navigate(['/credentials']);
    const module = await import('../credentials/credentials.page');
    expect(module.CredentialsPage).toBeTruthy();
    expect(location.path()).toBe('/credentials');
  });

  it('should navigate to SettingsPage for /settings', async () => {
    await router.navigate(['/settings']);
    const module = await import('../settings/settings.page');
    expect(module.SettingsPage).toBeTruthy();
    expect(location.path()).toBe('/settings');
  });

  it('should navigate to LogsPage for /logs', async () => {
    await router.navigate(['/logs']);
    const module = await import('../logs/logs.page');
    expect(module.LogsPage).toBeTruthy();
    expect(location.path()).toBe('/logs');
  });

  it('should navigate to LogsComponent for /logs', async () => {
    await router.navigate(['/logs']);
    const module = await import('../logs/logs/logs.component');
    expect(module.LogsComponent).toBeTruthy();
    expect(location.path()).toBe('/logs');
  });

  it('should navigate to CameraLogsPage for /logs/camera', async () => {
    await router.navigate(['/logs/camera']);
    const module = await import('../logs/camera-logs/camera-logs.page');
    expect(module.CameraLogsPage).toBeTruthy();
    expect(location.path()).toBe('/logs/camera');
  });

  it('should navigate to LanguageSelectorPage for /language-selector', async () => {
    await router.navigate(['/language-selector']);
    const module = await import('../language-selector/language-selector.page');
    expect(module.LanguageSelectorPage).toBeTruthy();
    expect(location.path()).toBe('/language-selector');
  });

  it('should redirect to / for unknown paths', async () => {
    await router.navigate(['tabs/unknown-path']);
    expect(location.path()).toBe('/home');
  });

  it('should apply AutoLoginPartialRoutesGuard on /', async () => {
    const mockGuard = TestBed.inject(AutoLoginPartialRoutesGuard);
    jest.spyOn(mockGuard, 'canActivate');
    await router.navigate(['/']);
    expect(mockGuard.canActivate).toHaveBeenCalled();
  });

  it('should call canActivateChild guard when navigating between child routes', async () => {
  const mockGuard = TestBed.inject(AutoLoginPartialRoutesGuard);
  jest.spyOn(mockGuard, 'canActivateChild');

  await router.navigate(['/home']);
  expect(mockGuard.canActivateChild).toHaveBeenCalledTimes(1);

  await router.navigate(['/credentials']);
  expect(mockGuard.canActivateChild).toHaveBeenCalledTimes(2);
});

  it('should apply logsEnabledGuard on /logs', async () => {
    const mockLogsGuard = TestBed.inject(logsEnabledGuard);

    jest.spyOn(mockLogsGuard, 'canActivate');

    await router.navigate(['/logs']);
    expect(mockLogsGuard.canActivate).toHaveBeenCalled();
  });
});
