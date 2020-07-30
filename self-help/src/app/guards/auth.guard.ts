import { Resolve, CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable, iif } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as fromAppReducer from '../store/app.reducer';
import * as fromAuthReducer from '../auth/store/auth.reducer';
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
    
    constructor(
        private authService: AuthService, 
        private router: Router,
        private store: Store<fromAppReducer.AppState>
    ) {}

    canActivate(
            route: ActivatedRouteSnapshot, 
            state: RouterStateSnapshot
        ) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |boolean | UrlTree {
            
            return this.store.select('auth').pipe(
                take(1),
                map((authState: fromAuthReducer.State) => {
                    if(authState.user) {
                        return true;
                    }
                    return this.router.createUrlTree(['/authorization']);
                })
            )
        }

        canActivateChild(
                childRoute: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot
            ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
                return this.canActivate(childRoute, state);
            }
}