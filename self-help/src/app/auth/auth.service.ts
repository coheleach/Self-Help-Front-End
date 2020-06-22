import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../models/User.model';
import { FirebaseUserPayload } from '../models/firebase-user-payload';


@Injectable({providedIn: 'root'})
export class AuthService {
    
    user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor(private httpClient: HttpClient) {}

    signUp(email: string, password: string) {
        return this.httpClient.post<FirebaseUserPayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(this.trySpruceFirebaseError(error));
        }));
    }

    signIn(email: string, password: string) {
        return this.httpClient.post<FirebaseUserPayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            tap((firebaseResponse: FirebaseUserPayload) => {
                const signedInUser = new User(
                    firebaseResponse.idToken,
                    firebaseResponse.email,
                    firebaseResponse.expiresIn,
                    firebaseResponse.localId
                );
                this.user.next(signedInUser);
        }),
         catchError((error: HttpErrorResponse) => {
                return throwError(this.trySpruceFirebaseError(error));
        }));
    }

    trySpruceFirebaseError(errorResponse: HttpErrorResponse): string {
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

            default:
                return errorResponse.error.error.message;
        }
    }
}