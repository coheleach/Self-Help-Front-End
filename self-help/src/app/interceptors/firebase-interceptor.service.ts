import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SignInMethod } from '../enums/sign-in-method.enum';
import { exhaustMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../store/app.reducer';
import * as fromAuthReducer from '../auth/store/auth.reducer';

@Injectable()
export class FirebaseInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService, private store: Store<fromAppReducer.AppState>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(take(1), exhaustMap((authData: fromAuthReducer.State) => {
            if(authData.user != null) {
                const alteredRequest = req.clone({params: req.params.append('auth', authData.user.idToken)});
                return next.handle(alteredRequest);
            }
            return next.handle(req);
        }));
    }
}