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
    console.log('auth service')
    this.subscribeToAuthEvents();
    this.checkAuth().subscribe();
  }
    private subscribeToAuthEvents(): void {
      console.log('subscribe')
      this.events.registerForEvents()
        .pipe(
          filter((e) =>
            [EventTypes.SilentRenewFailed, EventTypes.IdTokenExpired, EventTypes.TokenExpired].includes(e.type)
          )
        )
        .subscribe((event) => {
          switch (event.type) {
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
          this.name.next(this.userData?.name || '');
          this.token = accessToken;
        } else {
          console.warn('checkAuth: not authenticated')
        }
      }),
      catchError((err:any)=>{
        console.error('Error in initial checkAuth');
        return throwError(()=>err);
      })
    );
  }
  public logout() {
    return this.oidcSecurityService.logoffAndRevokeTokens();
  }

  public getToken(): string {
    return this.token;
  }
  public getName(): Observable<string> {
    return this.name$;
  }
}
