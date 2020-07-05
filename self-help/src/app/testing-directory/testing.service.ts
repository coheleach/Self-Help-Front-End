import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap, exhaustMap, map } from 'rxjs/operators';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { Todo } from '../models/Todo.model';

@Injectable({providedIn: 'root'})
export class TestingService {

    constructor(private authService: AuthService, private firebaseStorageService: FirebaseStorageService, private httpClient: HttpClient) { }

    executeTest() {
        this.authService.signIn("saucyflamingo@gmail.com","Jaybird7").pipe(
            exhaustMap(x => {
                //return this.firebaseStorageService.getAllUsersTodos().pipe(
                    //exhaustMap(x => {
                      return this.httpClient.get(
                        'https://ng-self-help.firebaseio.com/todos.json',
                        {
                            params: {
                                orderBy: '"user"',
                                equalTo: '"' + this.authService.user.value.email + '"'
                            },
                            observe: 'body',
                        }
                    );
                    
            })
            ,
            exhaustMap((responseBody: any) => {
                let array: Todo[] = [];
                for(const property in responseBody) {
                    for(const allStringTodo of responseBody[property]['todos']) {
                        array.push(
                            new Todo(
                                        allStringTodo['title'],
                                        allStringTodo['description'],
                                        allStringTodo['category'],
                                        new Date(allStringTodo['deadlineDate']),
                                        new Date(allStringTodo['creationDate']),
                                        allStringTodo['completed']
                                    )
                        )
                    }
                }
                return array;
            })).subscribe(x => console.log(x));
        }




    jerry() {
        // .pipe(exhaustMap((response: HttpResponse<any>) => {
                    //     console.log(response);
                    //     let responseBody = response['body'];
                    //     for(const property in responseBody) {
                    //         return responseBody[property].todos.map(allStringTodo => {
                    //             //Must convert stringified datetimes to datetimes
                    //             return new Todo(
                    //                 allStringTodo['title'],
                    //                 allStringTodo['description'],
                    //                 allStringTodo['category'],
                    //                 new Date(allStringTodo['deadlineDate']),
                    //                 new Date(allStringTodo['creationDate']),
                    //                 allStringTodo['completed']
                    //             );
                    //         });
                    //     }
                    // }));
                  //}).subscribe(x => console.log(x));
    }
}