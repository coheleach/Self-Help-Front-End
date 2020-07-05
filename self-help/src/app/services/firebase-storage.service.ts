import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Todo } from '../models/Todo.model';
import { Observable } from 'rxjs';
import { map, tap, catchError, flatMap, exhaustMap, exhaust } from 'rxjs/operators';
import { TodoService } from './todo.service';
import { TypeofExpr } from '@angular/compiler';
import { element } from 'protractor';
import { TodoListComponent } from '../to-dos/todo-list/todo-list.component';

@Injectable({providedIn: 'root'})
export class FirebaseStorageService {

    constructor(
        private httpClient: HttpClient, 
        private authService: AuthService) {}

    postUserTodoListNode(todoList: Todo[]): Observable<any> {
        return this.httpClient.post(
            "https://ng-self-help.firebaseio.com/todos.json",
            { user: this.authService.user.value.email, todos: todoList},
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
        return this.httpClient.get<HttpResponse<any>>(
            'https://ng-self-help.firebaseio.com/todos.json',
            {
                params: {
                    orderBy: '"user"',
                    equalTo: '"' + this.authService.user.value.email + '"'
                },
                observe: 'response',
            }
        )
        .pipe<Todo[]>(
            map((response: HttpResponse<any>) => {
            console.log(response);
            let todoArray: Todo[] = [];
            let responseBody = response['body'];
            for(let property in responseBody) {
                for(let allStringTodo of responseBody[property].todos) {// responseBody[property].todos.map(allStringTodo => {
                    //Must convert stringified datetimes to datetimes
                    todoArray.push( new Todo(
                        allStringTodo['title'],
                        allStringTodo['description'],
                        allStringTodo['category'],
                        new Date(allStringTodo['deadlineDate']),
                        new Date(allStringTodo['creationDate']),
                        allStringTodo['completed']
                    ));
                }
            }
            return todoArray;
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
        ).pipe<string>(exhaustMap(userNode => {
            for(let property in userNode) 
            {
                //userNode should have one property
                //and that is the key
                return property;
            }
        })
        ).pipe(exhaustMap((userNodeKey: string) => {
            const patchUrl = 'https://ng-self-help.firebaseio.com/todos/' + userNodeKey + '/todos.json';
            return this.httpClient.put(
            patchUrl,
            todoList
        );
        }));
    }
}