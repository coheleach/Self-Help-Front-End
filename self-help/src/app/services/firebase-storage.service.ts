import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Todo, TodoWithoutId } from '../models/Todo.model';
import { Observable, concat } from 'rxjs';
import { map, tap, catchError, flatMap, exhaustMap, exhaust, take } from 'rxjs/operators';
import { TodoService } from './todo.service';
import { TypeofExpr } from '@angular/compiler';
import { element } from 'protractor';
import { TodoListComponent } from '../to-dos/todo-list/todo-list.component';
import { TodoFactoryService } from '../helperServices/todo-factory.service';

@Injectable({providedIn: 'root'})
export class FirebaseStorageService {

    constructor(
        private httpClient: HttpClient, 
        private authService: AuthService,
        private todoFactoryService: TodoFactoryService) {}

    postUserTodoListNode(todoList: Todo[]): Observable<any> {
        return this.httpClient.post(
            "https://ng-self-help.firebaseio.com/todos.json",
            { user: this.authService.user.value.email, todos: TodoWithoutId.convertArray(todoList) },
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
        ).pipe(exhaustMap(userNode => {
            for(let property in userNode) 
            {
                console.log(userNode);
                console.log(property);
                //userNode should have one property
                //and that is the key
                const patchUrl = 'https://ng-self-help.firebaseio.com/todos/' + property + '/todos.json';
                return this.httpClient.put(
                patchUrl,
                TodoWithoutId.convertArray(todoList)
                );
            }
        }));
    }

    getUserNodeKey(): Observable<any> {
        return this.httpClient.get(
            'https://ng-self-help.firebaseio.com/todos.json',
            {
                params: {
                    orderBy: '"user"',
                    equalTo: '"' + this.authService.user.value.email + '"'
                },
                observe: 'body'
            }
        )
        .pipe(map(responseBody => {
            for(const obj in responseBody) {
                return obj.toString();
            }
        }));
    }
}