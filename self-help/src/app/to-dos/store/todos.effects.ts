import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Todo } from 'src/app/models/Todo.model';
import * as fromTodosActions from './todos.actions';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromAuthReducer from '../../auth/store/auth.reducer'
import * as fromTodosReducer from './todos.reducer';
import { User } from 'src/app/models/User.model';
import { TodoFactoryService } from 'src/app/helperServices/todo-factory.service';
import { InMemoryTodoRecallService } from 'src/app/helperServices/in-memory-todo-recall.service';
import { Observable } from 'rxjs';

export function retrieveFirebaseTodos(user: User, httpClient: HttpClient, todoFactoryService: TodoFactoryService): Observable<Todo[]> {
    return httpClient.get<HttpResponse<any>>(
        'https://ng-self-help.firebaseio.com/todos.json',
        {
            params: {
                orderBy: '"user"',
                equalTo: '"' + user.email + '"'
            },
            observe: 'response',
        }
    ).pipe(
        map((response: HttpResponse<any>) => {
            let todoArray: Todo[] = [];
            let responseBody = response['body'];
            console.log(responseBody);
            for(let property in responseBody) {
            //Prepare todo factory for this session
            //of id generation
                todoFactoryService.setUserNodeKey(property);
                if(responseBody[property].todos) {
                    let idIncrement = 0;
                    for(let allStringTodo of responseBody[property].todos) {
                        //Must convert stringified datetimes to datetimes
                        //and generate an id
                        todoArray.push(todoFactoryService.generateTodoWithoutId(
                            allStringTodo['title'],
                            allStringTodo['description'],
                            allStringTodo['category'],
                            new Date(allStringTodo['deadLineDate']),
                            new Date(allStringTodo['creationDate']),
                            allStringTodo['completed']
                        ));
                    }
                }
            }
            return todoArray;
        })
    );
}

export function useOldIdsIfPossible(store: Store<fromAppReducer.AppState>, todos: Todo[]): Observable<Todo[]> {

    return store.select('todos').pipe(
        take(1),
        map((todosState: fromTodosReducer.State) => {
            if(
                todosState.todos.lastFetchedTodos.length != 0
                &&
                todosState.todos.lastFetchedTodos.length == todos.length
            ) {
                for(let i = 0; i < todos.length; i++) {
                    todos[i].id = todosState.todos.lastFetchedTodos[i].id;
                }
            }
            return todos;
        })
    )
}

@Injectable()
export class TodosEffects {

    @Effect()
    fetchTodos = this.actions$.pipe(
        ofType(fromTodosActions.FETCH_TODOS),
        switchMap((dispatchedAction: fromTodosActions.FetchTodos) => {
            return this.store.select('auth').pipe(
                take(1),
                map((userState: fromAuthReducer.State) => {
                    return userState.user
                }),
                switchMap((user: User) => {
                    return retrieveFirebaseTodos(user, this.httpClient, this.todoFactoryService);
                }),
                switchMap((todosArray: Todo[]) => {
                    //Use the last saved todo ids if possible
                    //Otherwise we will regenerate ids for each fetch
                    //causing bugs downstream
                    return useOldIdsIfPossible(this.store, todosArray);
                }),
                map((todosArray: Todo[]) => {
                    return new fromTodosActions.SetTodos({ todos: todosArray, fromFirebase: true});
                })
            )
        })
    )

    @Effect({dispatch: false})
    logTodoChanges = this.actions$.pipe(
        ofType(fromTodosActions.CREATE_TODO, fromTodosActions.UPDATE_TODO, fromTodosActions.DELETE_TODO),
        switchMap(() => {
            return this.store.select('todos').pipe(
                take(1)
            )
        }),
        tap((todosState: fromTodosReducer.State) => {
            this.inMemoryTodoLocalRecallService.logTodosInLocalStorage(todosState.todos.elements);
        })
    )

    @Effect()
    revertToLastSavedTodos = this.actions$.pipe(
        ofType(fromTodosActions.REVERT_TODOS_LAST_CHANGED),
        // switchMap(() => {
        //     return this.store.select('auth').pipe(
        //         take(1)
        //     );
        // }),
        // switchMap((authState: fromAuthReducer.State) => {
        //     return retrieveFirebaseTodos(authState.user, this.httpClient, this.todoFactoryService);
        // }),
        // map((lastSavedTodoList: Todo[]) => {
        //     this.inMemoryTodoLocalRecallService.removeTodosInLocalStorage();
        //     return new fromTodosActions.SetTodos({ todos: lastSavedTodoList, fromFirebase: false});
        // })
        switchMap(() => {
            return this.store.select('todos').pipe(
                take(1)
            );
        }),
        map((todosState: fromTodosReducer.State) => {
            this.inMemoryTodoLocalRecallService.removeTodosInLocalStorage();
            return new fromTodosActions.SetTodos({ todos: todosState.todos.lastFetchedTodos, fromFirebase: false})
        })
    );
    
    constructor(
        private actions$: Actions,
        private httpClient: HttpClient,
        private todoFactoryService: TodoFactoryService,
        private inMemoryTodoLocalRecallService: InMemoryTodoRecallService,
        private store: Store<fromAppReducer.AppState>
    ) {}

    
}