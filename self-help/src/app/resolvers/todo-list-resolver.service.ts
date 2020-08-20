import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, throwError, empty } from 'rxjs';
import { TodoService } from '../services/todo.service';
import { AuthService } from '../auth/auth.service';
import { InMemoryTodoRecallService } from '../helperServices/in-memory-todo-recall.service';
import { TodoComparerService } from '../helperServices/todo-comparer.service';
import { Todo } from '../models/Todo.model';
import { map, exhaustMap, tap, take, flatMap, switchMap, exhaust } from 'rxjs/operators';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { userInfo } from 'os';
import { SignInMethod } from '../enums/sign-in-method.enum';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../store/app.reducer';
import * as fromAuthReducer from '../auth/store/auth.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';
import * as fromTodosReducer from '../to-dos/store/todos.reducer';
import * as fromTodosActions from '../to-dos/store/todos.actions';
import { User } from '../models/User.model';
import { Actions, ofType } from '@ngrx/effects';


@Injectable({providedIn: 'root'})
export class TodoListResolver implements Resolve<Todo[]> {
    
    private AuthStateCopy: fromAuthReducer.State;

    constructor( 
        private authService: AuthService, 
        private todoService: TodoService,
        private inMemoryTodoRecallService: InMemoryTodoRecallService,
        private firebaseDataService: FirebaseStorageService,
        private store: Store<fromAppReducer.AppState>,
        private actions$: Actions
    ) { 
        this.store.select('auth').subscribe(
            (authState: fromAuthReducer.State) => {
                this.AuthStateCopy = {
                    ...authState
                }
            }
        );
    }

    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<Todo[]> | Promise<Todo[]> | Todo[] {
            

            switch(this.AuthStateCopy.signInMethod) {
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

    private tryGetLastLoggedChanges() : Observable<Todo[]> | Todo[] {
        


        const localStorageTodos: Todo[] = this.inMemoryTodoRecallService.fetchTodosFromLocalStorage();
        if(localStorageTodos) {
            //this.todoService.updateTodos(localStorageTodos);
            this.store.dispatch(new fromTodosActions.SetTodos({ todos: localStorageTodos, fromFirebase: false}));
            return localStorageTodos;
        }
        
        this.store.dispatch(new fromTodosActions.FetchTodos());
        this.actions$.pipe(
            ofType(fromTodosActions.SET_TODOS),
            take(1)
        ).subscribe((todos: Todo[]) => {
                return todos;
            },
            error => {
                alert('encountered an error retrieving user todos');
            }
        );
    }

    private scaffoldNewUserStorage(): Todo[] | Observable<Todo[]> {
        
        let emptyTodoList: Todo[] = [];
        this.firebaseDataService.postUserTodoListNode(emptyTodoList).subscribe(
            (response) => {
                this.store.dispatch(new fromTodosActions.SetTodos({ todos: emptyTodoList, fromFirebase: false}));
                //this.todoService.updateTodos(emptyTodoList);
                //this.authService.signInMethod = SignInMethod.manual;
            },
            (error) => {
                alert('error creating storage space for new user... removing new account');
                this.authService.deleteUserAccount(this.AuthStateCopy.user.idToken).subscribe();
                this.store.dispatch(new fromAuthActions.AuthSignOut());
                //this.authService.signOut();
            });
        return emptyTodoList;
    }
}