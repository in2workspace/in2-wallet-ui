import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import routes from './callback.routes'; 

describe('App Routes', () => {
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  it('should navigate to CallbackPage for the default path', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/'); 

    // Verifica que el componente se carga correctamente
    const module = await import('./callback.page');
    expect(module.CallbackPage).toBeTruthy();
  });

  it('should redirect to / for unknown paths', async () => {
    await router.navigate(['/unknown-path']);
    expect(location.path()).toBe('/'); 
  });
});
