import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {
    
    constructor(private httpClient: HttpClient) {}

    signUp(email: string, password: string) {
        this.httpClient.post<HttpResponse<any>>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
            {
                'email': email,
                'password': password,
                'returnTokenSecure': true
            },
            {
                observe: 'response'
            }
        ).subscribe(response => {
            console.log(response);
        }, (error: HttpErrorResponse) => {
            console.log(error);
        });
    }

    signIn(email: string, password: string) {
        this.httpClient.post<HttpResponse<any>>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBomaslk7POZJLJfcQwoJ0jGwGFB7B5Fhc',
            {
                'email': email,
                'password': password,
                'returnTokenSecure': true
            },
            {
                observe: 'body'
            }
        ).subscribe(response => {
            console.log(response);
        }, (error: HttpErrorResponse) => {
            console.log(error);
        })
    }
}