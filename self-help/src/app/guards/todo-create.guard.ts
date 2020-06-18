import { CanDeactivate, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DeactivationComponent } from './deactivation-component';
import { TodoService } from '../services/todo.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class TodoCreateGuard implements CanDeactivate<DeactivationComponent>, CanActivate {

    constructor(private todoService: TodoService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
        ): Observable<boolean> | Promise<boolean> | boolean {
            
            const todos = this.todoService.getTodos();
            let index = +route.params['index'];
            if(
                !isNaN(index) 
                && 
                //index must correspond to existing todo
                todos[index] != null 
                &&
                //existing todo should only be edited if it's not currently complete
                !todos[index].completed 
                ) {
                return true;
            }
            this.router.navigate(['/'])
            return false;
        }

    canDeactivate(
        component: DeactivationComponent, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot
        ): Observable<boolean> | Promise<boolean> | boolean {

            return component.CanDeactivate();
        }
}