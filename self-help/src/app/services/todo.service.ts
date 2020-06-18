import { Todo } from '../models/Todo.model';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { FilteredTodoList } from '../models/FilteredTodoList.model';

@Injectable({providedIn: 'root'})
export class TodoService {

    private filteredTodoList: FilteredTodoList = new FilteredTodoList(
        [
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
        ]
    );

    todoListSubject: Subject<Todo[]> = new Subject<Todo[]>();

    getTodos(): Todo[] {
        return this.filteredTodoList.getTodoList();
    }

    getTodo(index: number): Todo {
        //This method disregards filters
        return this.filteredTodoList.getTodo(index);
    }

    addTodo(newTodo: Todo) {
        this.filteredTodoList.addTodo(newTodo);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    }

    updateTodo(index: number, todo: Todo) {
        this.filteredTodoList.updateTodo(index, todo);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    }

    removeTodoAtIndex(index: number) {
        this.filteredTodoList.removeTodoAtIndex(index);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    }

    setCompletionStatusFilter(status: string) {
        this.filteredTodoList.setCompletionStatusFilter(status);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    }

    setCategoryFilter(category: string[]) {
        this.filteredTodoList.setCategoryFilter(category);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    }

    clearAllFilters() {
        this.filteredTodoList.clearAllFilters();
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    }
}