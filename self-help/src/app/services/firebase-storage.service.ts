import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Todo } from '../models/Todo.model';
import { Observable } from 'rxjs';
import { map, tap, catchError, flatMap } from 'rxjs/operators';
import { TodoService } from './todo.service';
import { TypeofExpr } from '@angular/compiler';
import { element } from 'protractor';

@Injectable({providedIn: 'root'})
export class FirebaseStorageService {

    constructor(
        private httpClient: HttpClient, 
        private authService: AuthService) {}

    storeTodos(todos: Todo[]): Observable<any> {
        let requestPayload = todos.map((todo: Todo) => {{
            return {...todo, user: this.authService.user.value.email};
        }});

        // let requestPayload = [
        //     new Todo('title1', 'desc1', 'cat1', new Date(), new Date(), false),
        //     new Todo('title2', 'desc2', 'cat2', new Date(), new Date(), false),
        //     new Todo('title3', 'desc3', 'cat3', new Date(), new Date(), false)
        // ];
        
        return this.httpClient.post(
            "https://ng-self-help.firebaseio.com/todos.json",
            { user: this.authService.user.value.email, todos: requestPayload},
            {
                observe: 'response'
            }
        );
    }

    deleteAllTodos(): Observable<any> {
        return this.httpClient.delete(
            'https://ng-self-help.firebaseio.com/todos.json',
            {
                observe: 'response'
            }
        );
    }

    getAllUsersTodos(): Observable<Todo[]> {
        return this.httpClient.get(
            'https://ng-self-help.firebaseio.com/todos.json',
            {
                params: {
                    orderBy: '"user"',
                    equalTo: '"' + this.authService.user.value.email + '"'
                },
                observe: 'body',
            }
        )
        .pipe<Todo[]>(map(responseBody => {
                for(const property in responseBody) {
                    return responseBody[property].todos.map(allStringTodo => {
                        //Must convert stringified datetimes to datetimes
                        return new Todo(
                            allStringTodo['title'],
                            allStringTodo['description'],
                            allStringTodo['category'],
                            new Date(allStringTodo['deadlineDate']),
                            new Date(allStringTodo['creationDate']),
                            allStringTodo['completed']
                        );
                    });
                }
            }));
    }

    putUsersTodos(todoList: Todo[]): Observable<any> {      
        return this.httpClient.get(
            'https://ng-self-help.firebaseio.com/todos.json',
            {
                params: {
                    orderBy: '"user"',
                    equalTo: '"' + this.authService.user.value.email + '"'
                },
                observe: 'body'
            }
        ).pipe<string>(map(userNode => {
            console.log('get usernode fired');
            for(let property in userNode) 
            {
                //userNode should have one property
                //and that is the key
                return property;
            }
        })
        ).pipe(flatMap((userNodeKey: string) => {
            const patchUrl = 'https://ng-self-help.firebaseio.com/todos/' + userNodeKey + '/todos.json';
            return this.httpClient.put(
            patchUrl,
            todoList
        );
        }));
    }
}