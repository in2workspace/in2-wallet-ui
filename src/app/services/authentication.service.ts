import { Injectable } from '@angular/core';
import { EventTypes, LoginResponse, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, filter, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IAM_POST_LOGOUT_URI } from '../constants/iam.constants';

class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(message: any) {
    if (this.onmessage) {
      this.onmessage({ data: message } as MessageEvent);
    }
  }

  close() {
  }
}

(globalThis as any).BroadcastChannel = MockBroadcastChannel;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public name: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public name$: Observable<string> = this.name.asObservable();
  private token!: string;
  private userData: { name:string } | undefined;
  private bc = new BroadcastChannel('auth');

  public constructor(public oidcSecurityService: OidcSecurityService,
    public events: PublicEventsService
  ) {
    this.subscribeToAuthEvents();
    this.checkAuth$().subscribe();
    this.listenToCrossTabLogout();
  }
    private subscribeToAuthEvents(): void {
      this.events.registerForEvents()
        .pipe(
          filter((e) =>
            [EventTypes.SilentRenewStarted, EventTypes.SilentRenewFailed, EventTypes.IdTokenExpired, EventTypes.TokenExpired].includes(e.type)
          )
        )
        .subscribe((event) => {
          switch (event.type) {
            case EventTypes.SilentRenewStarted:
              console.log('Silent renew started');
              break;

            case EventTypes.SilentRenewFailed:
              const isOffline = !navigator.onLine;

              if (isOffline) {
                console.warn('Silent token refresh failed: offline mode', event);

                const onlineHandler = () => {
                  console.log('Connection restored. Retrying to authenticate...');
                  this.checkAuth$().subscribe(
                    {
                      next: ({ isAuthenticated, userData, accessToken }) => {
                        if (!isAuthenticated) {
                          console.warn('User still not authenticated after reconnect, logging out');
                          this.logout$().subscribe();
                        } else {
                          console.log('User reauthenticated successfully after reconnect');
                        }
                      },
                      error: (err) => {
                        console.error('Error while reauthenticating after reconnect:', err);
                        this.logout$().subscribe();
                      },
                      complete: () => {
                        window.removeEventListener('online', onlineHandler);
                      }
                    });
                  
                };

                  window.addEventListener('online', onlineHandler);

              } else {
                console.error('Silent token refresh failed: online mode, proceeding to logout', event);
                this.logout$().subscribe();
              }
              break;

            case EventTypes.IdTokenExpired:
            case EventTypes.TokenExpired:
              console.error('Session expired:', event);
              this.logout$().subscribe();
              break;
          }
        });
  }
  public checkAuth$(): Observable<LoginResponse> {
    console.log('Check auth: Authenticating.')
    return this.oidcSecurityService.checkAuth().pipe(
      tap(({ isAuthenticated, userData, accessToken }) => {
        if (isAuthenticated) {
          this.updateUserData(userData, accessToken);
        } else {
          //this part can only be reached if accessing the app through a route that has not AutoLoginPartialRoutesGuard
          console.warn('Check auth: not authenticated')
        }
      }),
      catchError((err:any)=>{
        //this part can only be reached if accessing the app through a route that has not AutoLoginPartialRoutesGuard
        console.error('Check auth: error in initial authentication');
        return throwError(()=>err);
      })
    );
  }
  public updateUserData(userData:any, accessToken:string): void{
    this.userData = userData;
    this.name.next(this.userData?.name ?? '');
    this.token = accessToken;
  }

  public listenToCrossTabLogout(): void{
    this.bc.onmessage = (event) => {
      console.log('Received Broadcast message: ', event);
      if (event.data === 'forceWalletLogout') {
          console.warn('Detected logout with revoke, logging out locally');
          this.localLogout();
      }
    };
  }

private localLogout(): void {
  console.log('Redirect to origin.');
  sessionStorage.clear();
  window.location.assign(IAM_POST_LOGOUT_URI);
}


  public logout$(): Observable<any> {
    console.log('Logout')
    // since we store tokens in session storage we need to sync logout between different tabs

    return this.oidcSecurityService.logoffAndRevokeTokens().pipe(
      tap(() => {
        console.log('Logout with revoke completed.')
        this.bc.postMessage('forceWalletLogout');
      }),
      catchError((err:Error)=>{
        console.error('Error when logging out.');
        console.error(err);
        return throwError(()=>err)
      })
    );
  }

  public getToken(): string {
    return this.token;
  }
  public getName$(): Observable<string> {
    return this.name$;
  }
}
