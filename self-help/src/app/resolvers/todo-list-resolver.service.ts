import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoService } from '../services/todo.service';
import { AuthService } from '../auth/auth.service';
import { InMemoryTodoRecallService } from '../helperServices/in-memory-todo-recall.service';
import { TodoComparerService } from '../helperServices/todo-comparer.service';
import { Todo } from '../models/Todo.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TodoListResolver implements Resolve<Todo[]> {
    
    constructor(
        private todoService: TodoService, 
        private authService: AuthService, 
        private inMemoryTodoRecallService: InMemoryTodoRecallService) { }

    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<Todo[]> | Promise<Todo[]> | Todo[] {

        const localStorageTodos = this.inMemoryTodoRecallService.fetchTodosFromLocalStorage();

        //CASE 1: User Todos are being loaded in through firebase
        //Use these once they are loaded
        if(!this.todoService.resolvingTodosSubscription.closed) {
            return this.todoService.todoListSubject.pipe(map((todoList: Todo[]) => {
                if(this.authService.AutoSignedIn) {
                    if(!TodoComparerService.todoArraysAreTheSame(todoList, localStorageTodos)) {
                        this.todoService.updateTodos(localStorageTodos);
                        return this.inMemoryTodoRecallService.fetchTodosFromLocalStorage();
                    } else {
                        todoList;
                    }
                }
            }));
        }
        return this.todoService.getTodos();
    }
}