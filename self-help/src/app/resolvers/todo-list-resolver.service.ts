import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TodoService } from '../services/todo.service';
import { AuthService } from '../auth/auth.service';
import { InMemoryTodoRecallService } from '../helperServices/in-memory-todo-recall.service';
import { TodoComparerService } from '../helperServices/todo-comparer.service';
import { Todo } from '../models/Todo.model';
import { map, exhaustMap, tap, take, flatMap } from 'rxjs/operators';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { userInfo } from 'os';
import { SignInMethod } from '../enums/sign-in-method.enum';

@Injectable({providedIn: 'root'})
export class TodoListResolver implements Resolve<Todo[]> {
    
    constructor( 
        private authService: AuthService, 
        private todoService: TodoService,
        private inMemoryTodoRecallService: InMemoryTodoRecallService,
        private firebaseDataService: FirebaseStorageService) { }

    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<Todo[]> | Promise<Todo[]> | Todo[] {
            
            switch(this.authService.signInMethod) {
                case SignInMethod.none:
                    return null;
                case SignInMethod.manual:
                    return this.tryGetLastLoggedChanges();
                case SignInMethod.auto:
                    return this.tryGetLastLoggedChanges();
                case SignInMethod.signUp:
                    return this.scaffoldNewUserStorage();
                default:
                    return null;
            }
    }

    private getStoredTodos(): Observable<Todo[]> {

        return this.firebaseDataService.getAllUsersTodos().pipe(
            tap((todoList: Todo[]) => {
                this.todoService.updateTodos(todoList);
            }),
            error => {
                alert('error accessing user data...');
                console.log(error);
                this.authService.signOut();
                return null;
            });
    }

    private tryGetLastLoggedChanges() : Observable<Todo[]> | Todo[] {
        const localStorageTodos: Todo[] = this.inMemoryTodoRecallService.fetchTodosFromLocalStorage();
        if(!localStorageTodos) {
            return this.getStoredTodos();
        }
        this.todoService.updateTodos(localStorageTodos);
        return localStorageTodos;
    }

    private scaffoldNewUserStorage(): Todo[] | Observable<Todo[]> {
        const emptyTodoList: Todo[] = [];
        return this.firebaseDataService.postUserTodoListNode(emptyTodoList).pipe(flatMap(response => {
            console.log(response);
            this.todoService.updateTodos(emptyTodoList);
            this.authService.signInMethod = SignInMethod.manual;
            return emptyTodoList;
        }), error => {
            alert('error creating storage space for new user... removing new account');
            this.authService.deleteUserAccount().subscribe();
            this.authService.signOut();
            return null;
        });
    }
}