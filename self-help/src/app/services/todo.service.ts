import { Todo } from '../models/Todo.model';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class TodoService {

    private todos: Todo[] = [
        new Todo(
            'Get Bread',
            'Pick up a loaf of bread from the grocery store',
            'groceries',
            new Date(2019, 6, 9)
        ),
        new Todo(
            'Pick jeffrey up from Daycare',
            '',
            'family',
            new Date(2020, 12, 1)
        ),
        new Todo(
            'Clear the lawn',
            'Just the leaves',
            'maintinence',
            new Date(20201, 1, 1)
        )
    ];

    getTodos(): Todo[] {
        return this.todos.slice();
    }


}