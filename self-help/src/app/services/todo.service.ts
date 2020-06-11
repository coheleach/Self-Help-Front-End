import { Todo } from '../models/Todo.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TodoService {

    completionStatusFilter: Subject<string> = new Subject<string>();
    categoryFilter: Subject<string> = new Subject<string>();

    private todos: Todo[] = [
        new Todo(
            'Get Bread',
            'Pick up a loaf of bread from the grocery store',
            'groceries',
            new Date(2019, 6, 9,),
            new Date(2019,1,1),
            true
        ),
        new Todo(
            'Pick jeffrey up from Daycare',
            '',
            'family',
            new Date(2020, 12, 1),
            new Date(2019,2,2),
            false
        ),
        new Todo(
            'Clear the lawn',
            'Just the leaves',
            'maintinence',
            new Date(2021, 1, 1),
            new Date(2019,3,3),
            false
        )
    ];

    getTodos(): Todo[] {
        return this.todos.slice();
    }

    setCompletionStatusFilter(status: string) {
        this.completionStatusFilter.next(status);
    }

    setCategoryFilter(category: string) {
        this.categoryFilter.next(category);
    }

    clearAllFilters() {
        this.completionStatusFilter.next('');
        this.categoryFilter.next('');
    }
}