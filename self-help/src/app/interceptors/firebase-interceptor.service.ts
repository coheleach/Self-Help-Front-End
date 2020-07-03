import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SignInMethod } from '../enums/sign-in-method.enum';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class FirebaseInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(
        req: HttpRequest<any>, 
        next: HttpHandler)
        : Observable<HttpEvent<any>> {
            return this.authService.user.pipe(take(1), exhaustMap(user => {
                if(user != null) {
                    const alteredRequest: HttpRequest<any> = req.clone({setHeaders: {
                        auth: this.authService.user.value.idToken
                    }});
                    return next.handle(alteredRequest);
                }
                return next.handle(req);
            }));
    }
}