import { Injectable } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/Todo.model';
import { AuthService } from '../auth/auth.service';
import { TodoComparerService } from './todo-comparer.service';

@Injectable({providedIn: 'root'})
export class InMemoryTodoRecallService {
    

    logTodosInLocalStorage(todoList: Todo[]) {
        localStorage.setItem('todoList', JSON.stringify(todoList));
    }

    removeTodosInLocalStorage() {
        localStorage.removeItem('todoList');
    }

    fetchTodosFromLocalStorage(): Todo[] {
        if(!localStorage.getItem('todoList')) {
            return null;
        }
        const stringList = JSON.parse(localStorage.getItem('todoList'));
        let todoArray: Todo[] = stringList.map(stringTodo => {
            return new Todo(
                stringTodo['id'],
                stringTodo['title'],
                stringTodo['description'],
                stringTodo['category'],
                new Date(stringTodo['deadlineDate']),
                new Date(stringTodo['creationDate']),
                stringTodo['completed']
            );
        });
        return todoArray;
    }

    isTodoListSameAsStorageList(todoList: Todo[]): boolean {
        return(TodoComparerService.todoArraysAreTheSame(
            this.fetchTodosFromLocalStorage(),
            todoList
        ))
    }
}