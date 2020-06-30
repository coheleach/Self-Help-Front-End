import { Injectable } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/Todo.model';
import { AuthService } from '../auth/auth.service';
import { TodoComparerService } from './todo-comparer.service';

@Injectable({providedIn: 'root'})
export class InMemoryRecallService {
    
    logTodosInLocalStorage(todoList: Todo[]) {
        localStorage.setItem('todoList', JSON.stringify(todoList));
    }

    fetchTodosFromLocalStorage(): Todo[] {
        const stringList = JSON.parse(localStorage.getItem('todoList'));
        let todoArray: Todo[] = stringList.map(stringTodo => {
            JSON.parse(stringTodo);
        })
        return todoArray;
    }

    logUnsavedEdit() {
        localStorage.setItem('unsavedEdit', 'true');
    }

    logSavedEdits() {
        localStorage.setItem('unsavedEdit', 'false');
    }

    isTodoListSameAsStorageList(todoList: Todo[]): boolean {
        return(TodoComparerService.todoArraysAreTheSame(
            this.fetchTodosFromLocalStorage(),
            todoList
        ))
    }
}