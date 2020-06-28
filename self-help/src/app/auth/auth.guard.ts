import { Resolve, CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable, iif } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
    
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
            route: ActivatedRouteSnapshot, 
            state: RouterStateSnapshot
        ) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |boolean | UrlTree {
            return this.authService.user.pipe(take(1), map(user => {
                if(user) {
                    return true;
                }
                return this.router.createUrlTree(['/authorization']);
            }));
        }

        canActivateChild(
                childRoute: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot
            ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
                return this.canActivate(childRoute, state);
            }
}