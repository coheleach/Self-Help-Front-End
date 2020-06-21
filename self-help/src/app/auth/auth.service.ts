import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
    
    constructor(private httpClient: HttpClient) {}

    signUp(email: string, password: string) {
        return this.httpClient.post<HttpResponse<any>>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
            {
                'email': email,
                'password': password,
                'returnTokenSecure': true
            },
            {
                observe: 'response'
            }
        ).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(this.trySpruceFirebaseError(error));
        }));
    }

    signIn(email: string, password: string) {
        return this.httpClient.post<HttpResponse<any>>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
            {
                'email': email,
                'password': password,
                'returnTokenSecure': true
            },
            {
                observe: 'body'
            }
        ).pipe(catchError((error: HttpErrorResponse) => {
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