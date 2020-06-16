import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DeactivationComponent } from './deactivation-component';


export class TodoCreateGuard implements CanDeactivate<DeactivationComponent> {

    canDeactivate(
        component: DeactivationComponent, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

            return component.CanDeactivate();
        }
}