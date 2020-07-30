import { Effect, ofType, Actions } from '@ngrx/effects'
import * as fromAuthActions from './auth.actions';
import * as fromAppReducer from '../../store/app.reducer';
import { Router } from '@angular/router';
import { tap, catchError, switchMap, map, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FirebaseUserPayload } from 'src/app/models/firebase-user-payload';
import { of } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { Store } from '@ngrx/store';
import { error } from 'protractor';

@Injectable()
export class AuthEffects {
  
  @Effect()
  authRequestSignIn = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_REQUEST_SIGN_IN),
    switchMap((dispatchedAction: fromAuthActions.AuthRequestSignIn) => {
      //this.signInMethod = SignInMethod.signUp;
        return this.httpClient.post<FirebaseUserPayload>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
          {
              email: dispatchedAction.payload.email,
              password: dispatchedAction.payload.password,
              returnSecureToken: true
          }
        ).pipe(
            map((response: FirebaseUserPayload) => {
            const numSeconds = +response.expiresIn;
            let date = new Date();
            date.setSeconds(new Date().getSeconds() + numSeconds);
            const signedInUser = new User(
              response.idToken,
              response.email,
              date,
              response.localId
            );
            return new fromAuthActions.AuthSignIn(signedInUser);
            //this.user.next(signedInUser);

            //this.prepareUserAutoSignOut(signedInUser);
            //store user info in local storage
            //localStorage.setItem('user', JSON.stringify(signedInUser));
            
            //this.router.navigate(['/todos']);
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          if(!errorResponse.error || !errorResponse.error.error || !errorResponse.error.error.message) {
            //Not expected format. Just pass whatever it is on.
            return of(new fromAuthActions.AuthRequestSigninDenied(errorResponse.message));
          }
          let errorMessage;
          switch(errorResponse.error.error.message) {
              case 'EMAIL_NOT_FOUND':
                  errorMessage = 'Email is not currently registered';
              case 'INVALID_PASSWORD':
                  errorMessage = 'Password not associated with this user email';
              case 'EMAIL_EXISTS':
                  errorMessage = 'This email has already been registered with a password';
              case 'USER_DISABLED':
                  errorMessage = 'The user account has been disabled by an administrator';
              default:
                  errorMessage = errorResponse.error.error.message;
          }
          return of(new fromAuthActions.AuthRequestSigninDenied(errorMessage));
        })
      )
    })
  )

  @Effect({dispatch: false})
  authSignInRedirect = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_SIGN_IN),
    tap(() => {
      this.router.navigate(['/todos']);
    })
  )
  

  @Effect({dispatch: false})
  authSignOutRedirect = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_SIGN_OUT),
    tap(() => {
      this.router.navigate(['/authorization']);
    })
  )

  constructor(
    private actions$: Actions,  
    private router: Router,
    private httpClient: HttpClient
  ) {}
}