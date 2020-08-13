import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Todo } from 'src/app/models/Todo.model';
import * as fromTodosActions from './todos.actions';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
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

@Injectable()
export class TodosEffects {

    @Effect()
    fetchTodos = this.actions$.pipe(
        ofType(fromTodosActions.FETCH_TODOS),
        switchMap((dispatchedAction: fromTodosActions.FetchTodos) => {
            return this.store.select('auth').pipe(
                map((userState: fromAuthReducer.State) => {
                    return userState.user
                }),
                switchMap((user: User) => {
                    return this.httpClient.get<HttpResponse<any>>(
                        'https://ng-self-help.firebaseio.com/todos.json',
                        {
                            params: {
                                orderBy: '"user"',
                                equalTo: '"' + user.email + '"'
                            },
                            observe: 'response',
                        }
                    )
                }),
                map((response: HttpResponse<any>) => {
                    let todoArray: Todo[] = [];
                    let responseBody = response['body'];
                    console.log(responseBody);
                    for(let property in responseBody) {
                    //Prepare todo factory for this session
                    //of id generation
                        this.todoFactoryService.setUserNodeKey(property);
                        if(responseBody[property].todos) {
                            let idIncrement = 0;
                            for(let allStringTodo of responseBody[property].todos) {
                                //Must convert stringified datetimes to datetimes
                                //and generate an id
                                todoArray.push(this.todoFactoryService.generateTodoWithoutId(
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
                    return new fromTodosActions.SetTodos(todoArray);
                })
            )
        })
    )

    @Effect({dispatch: false})
    logTodoChanges = this.actions$.pipe(
        ofType(fromTodosActions.CREATE_TODO),
        switchMap(() => {
            return this.store.select('todos')
        }),
        tap((todosState: fromTodosReducer.State) => {
            this.inMemoryTodoLocalRecallService.logTodosInLocalStorage(todosState.todos.elements);
        })
    )

    @Effect()
    revertToLastSavedTodos = this.actions$.pipe(
        ofType(fromTodosActions.REVERT_TODOS_LAST_CHANGED),
        switchMap(() => {
            return this.store.select('auth');
        }),
        switchMap((authState: fromAuthReducer.State) => {
            return retrieveFirebaseTodos(authState.user, this.httpClient, this.todoFactoryService);
        }),
        map((lastSavedTodoList: Todo[]) => {
            this.inMemoryTodoLocalRecallService.removeTodosInLocalStorage();
            return new fromTodosActions.SetTodos(lastSavedTodoList);
        }),
    );
    
    constructor(
        private actions$: Actions,
        private httpClient: HttpClient,
        private todoFactoryService: TodoFactoryService,
        private inMemoryTodoLocalRecallService: InMemoryTodoRecallService,
        private store: Store<fromAppReducer.AppState>
    ) {}

    
}