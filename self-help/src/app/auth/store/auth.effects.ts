import { Effect, ofType, Actions } from '@ngrx/effects'
import * as fromAuthActions from './auth.actions';
import { Router } from '@angular/router';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FirebaseUserPayload } from 'src/app/models/firebase-user-payload';
import { of } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { AuthService } from '../auth.service';

const constructUser = (payload: FirebaseUserPayload): User => {
  const numSeconds = +payload.expiresIn;
  let date = new Date();
  date.setSeconds(new Date().getSeconds() + numSeconds);
  return new User(
    payload.idToken,
    payload.email,
    date,
    payload.localId
  );
}

const refineErrorMessage = (errorResponse: HttpErrorResponse): string => {
  if(!errorResponse.error || !errorResponse.error.error || !errorResponse.error.error.message) {
    //Not expected format. Just pass whatever it is on.
    return errorResponse.message;
  }
  switch(errorResponse.error.error.message) {
    case 'EMAIL_NOT_FOUND':
        return 'Email is not currently registered';
    case 'INVALID_PASSWORD':
        return 'Password not associated with this user email';
    case 'EMAIL_EXISTS':
        return 'This email has already been registered with a password';
    case 'USER_DISABLED':
        return 'The user account has been disabled by an administrator';
    default:
        return errorResponse.error.error.message;
  }
}
@Injectable()
export class AuthEffects {
  
  @Effect()
  authRequestSignUp = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_REQUEST_SIGN_UP),
    switchMap((dispatchedAction: fromAuthActions.AuthRequestSignUp) => {
      return this.httpClient.post<FirebaseUserPayload>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
        {
            email: dispatchedAction.payload.email,
            password: dispatchedAction.payload.password,
            returnSecureToken: true
        }
      ).pipe(
        map((firebaseResponse: FirebaseUserPayload) => {
            return new fromAuthActions.AuthSignIn(constructUser(firebaseResponse));
        }
      ), 
      catchError((errorResponse: HttpErrorResponse) => {
        return of(new fromAuthActions.AuthRequestSignUpDenied(refineErrorMessage(errorResponse)));
      }));
    })
  )

  @Effect()
  authRequestSignIn = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_REQUEST_SIGN_IN),
    switchMap((dispatchedAction: fromAuthActions.AuthRequestSignIn) => {
      return this.httpClient.post<FirebaseUserPayload>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
        {
            email: dispatchedAction.payload.email,
            password: dispatchedAction.payload.password,
            returnSecureToken: true
        }
      ).pipe(
        map((firebaseResponse: FirebaseUserPayload) => {
          return new fromAuthActions.AuthSignIn(constructUser(firebaseResponse));
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          return of(new fromAuthActions.AuthRequestSignUpDenied(refineErrorMessage(errorResponse)));
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
  authSignInLocalStorage = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_SIGN_IN),
    tap((dispatchedAction: fromAuthActions.AuthSignIn) => {
      localStorage.setItem('user', JSON.stringify(dispatchedAction.payload))
    })
  )

  @Effect({dispatch: false})
  authprepareAutoSignOut = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_SIGN_IN),
    map((dispatchedAction: fromAuthActions.AuthSignIn) => {
      this.authService.prepareUserAutoSignOut(dispatchedAction.payload);
    })
  )

  @Effect({dispatch: false})
  authSignOutRedirect = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_SIGN_OUT),
    tap(() => {
      this.router.navigate(['/authorization']);
    })
  )

  @Effect({dispatch: false})
  authSignOutLocalStorage = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_SIGN_OUT),
    tap(() => {
      localStorage.clear();
    })
  )

  @Effect()
  authAutoSignInStart = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_AUTO_SIGN_IN_START),
    map(() => {
      const lastUserData = JSON.parse(localStorage.getItem('user'));
        if(lastUserData) {
            const lastUser: User = new User(
                lastUserData['idToken'],
                lastUserData['email'],
                new Date(lastUserData['expirationDateTime']),
                lastUserData['localId']
            );
            if(lastUser.expirationDateTime > new Date()) {
                return new fromAuthActions.AuthSignIn(lastUser);
            }
        }
        return new fromAuthActions.AuthAutoSignInFail();
    })
  )

  constructor(
    private actions$: Actions,  
    private router: Router,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}
}