import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../models/User.model';
import { FirebaseUserPayload } from '../models/firebase-user-payload';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class AuthService {
    
    user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    signOutTimer: any;

    constructor(private httpClient: HttpClient, private router: Router) {}

    signUp(email: string, password: string) {
        return this.httpClient.post<FirebaseUserPayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            tap((firebaseResponse: FirebaseUserPayload) => {
                this.signInWithFirebaseUserPayload(firebaseResponse);
            }
        ), catchError((error: HttpErrorResponse) => {
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
                this.signInWithFirebaseUserPayload(firebaseResponse);
            }
        ), catchError((error: HttpErrorResponse) => {
                return throwError(this.trySpruceFirebaseError(error));
        }));
    }

    signOut() {
        this.user.next(null);
        localStorage.removeItem('user');
        this.router.navigate(['/authorization']);
    }

    tryAutoSignIn() {
        const lastUserData = JSON.parse(localStorage.getItem('user'));
        if(lastUserData) {
            const lastUser: User = new User(
                lastUserData['idToken'],
                lastUserData['email'],
                new Date(lastUserData['expirationDateTime']),
                lastUserData['localId']
            );

            if(lastUser.expirationDateTime > new Date()) {
                this.user.next(lastUser);
                this.prepareUserAutoSignOut(lastUser);
            }
        }
    }

    prepareUserAutoSignOut(user: User) {
        const millisecondsToSignOut = (user.expirationDateTime.getTime() - new Date().getTime());
        console.log('logging user out in seconds: ' + millisecondsToSignOut / 1000);
        this.signOutTimer = setTimeout(() => {
            console.log('invoking signOut()');
            this.signOut();
        }, millisecondsToSignOut);
    }    

    private trySpruceFirebaseError(errorResponse: HttpErrorResponse): string {
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

    private signInWithFirebaseUserPayload(firebaseUserPayload: FirebaseUserPayload): void {
        const signedInUser = new User(
            firebaseUserPayload.idToken,
            firebaseUserPayload.email,
            this.dateTimePlusSeconds(firebaseUserPayload.expiresIn),
            firebaseUserPayload.localId
        );
        this.user.next(signedInUser);
        console.log(signedInUser);
        this.prepareUserAutoSignOut(signedInUser);
        //store user info in local storage
        localStorage.setItem('user', JSON.stringify(signedInUser));
        this.router.navigate(['/todos']);
    }

    private dateTimePlusSeconds(seconds: string): Date {
        const numSeconds = +seconds;
        let date = new Date();
        date.setSeconds(new Date().getSeconds() + numSeconds);
        return date;
    }
}