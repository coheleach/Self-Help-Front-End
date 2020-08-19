import { CanDeactivate, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DeactivationComponent } from './deactivation-component';
import { TodoService } from '../services/todo.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as fromAppReducer from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { take, map } from 'rxjs/operators';
import * as fromTodosReducer from '../to-dos/store/todos.reducer';
import { Todo } from '../models/Todo.model';

@Injectable()
export class TodoCreateGuard implements CanDeactivate<DeactivationComponent>, CanActivate {

    constructor(
        private todoService: TodoService, 
        private router: Router,
        private store: Store<fromAppReducer.AppState>
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
            
        //const todos = this.todoService.getTodos();
        let id = route.params['id'];
        return this.store.select('todos').pipe(
            take(1),
            map((todosState: fromTodosReducer.State) => {
                return todosState.todos.elements;
            }),
            map((todos: Todo[]) => {
                if(
                    todos 
                    && 
                    //index must correspond to existing todo
                    //this.todoService.getTodoById(id) != null 
                    todos.find((todoElement, index) => { return todoElement.id == id })
                    &&
                    //existing todo should only be edited if it's not currently complete
                    //!this.todoService.getTodoById(id).completed
                    !todos.find((todoElement, index) => { return todoElement.id == id }).completed
                ) {
                    return true;
                }
                this.router.navigate['/'];
                console.log('you just got rejected by the guard');
                return false;
            })
        )
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