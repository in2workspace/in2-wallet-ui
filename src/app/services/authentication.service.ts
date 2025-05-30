import { Injectable } from '@angular/core';
import { EventTypes, LoginResponse, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, filter, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public name: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public name$: Observable<string> = this.name.asObservable();
  private token!: string;
  private userData: { name:string } | undefined;

  public constructor(public oidcSecurityService: OidcSecurityService,
    public events: PublicEventsService
  ) {
    this.subscribeToAuthEvents();
    this.checkAuth().subscribe();
    this.listenToCrossTabLogout();
  }
    private subscribeToAuthEvents(): void {
      this.events.registerForEvents()
        .pipe(
          filter((e) =>
            [EventTypes.SilentRenewFailed, EventTypes.IdTokenExpired, EventTypes.TokenExpired].includes(e.type)
          )
        )
        .subscribe((event) => {
          switch (event.type) {
            case EventTypes.SilentRenewStarted:
              console.log('Silent renew started');
              break;

            case EventTypes.SilentRenewFailed:
              console.warn('Silent renew failed:', event);
              break;

            case EventTypes.IdTokenExpired:
            case EventTypes.TokenExpired:
              console.error('Session expired:', event);
              this.logout();
              break;
          }
        });
  }
  public checkAuth(): Observable<LoginResponse> {
    console.log('checkAuth')
    return this.oidcSecurityService.checkAuth().pipe(
      tap(({ isAuthenticated, userData, accessToken }) => {
        if (isAuthenticated) {
          this.userData = userData;
          this.name.next(this.userData?.name ?? '');
          this.token = accessToken;
        } else {
          //this part can only be reached if accessing the app through a route that has not AutoLoginPartialRoutesGuard
          console.warn('checkAuth: not authenticated')
        }
      }),
      catchError((err:any)=>{
        //this part can only be reached if accessing the app through a route that has not AutoLoginPartialRoutesGuard
        console.error('Error in initial checkAuth');
        return throwError(()=>err);
      })
    );
  }
  public listenToCrossTabLogout(){
    window.addEventListener('storage', (event) => {
      if (event.key === 'forceWalletLogout') {
        console.warn('Detected logout in other tab, logging out here too');
        this.logout();
      }
    });
  }

  public logout() {
    // since we store tokens in session storage we need to sync logout between different tabs
    localStorage.setItem('forceWalletLogout', Date.now().toString());
    return this.oidcSecurityService.logoffAndRevokeTokens();
  }

  public getToken(): string {
    return this.token;
  }
  public getName$(): Observable<string> {
    return this.name$;
  }
}
