import { Injectable } from '@angular/core';
import { Todo } from '../models/Todo.model';

@Injectable({providedIn: 'root'})
export class TodoComparerService {

    public static todosAreTheSame(todo_1: Todo, todo_2: Todo): boolean {
        return JSON.stringify(todo_1) === JSON.stringify(todo_2);
    }

    public static todoArraysAreTheSame(todoList_1: Todo[], todoList_2: Todo[]) {
        if(todoList_1 && todoList_2) {
            //Don't return true for null values
            if(todoList_1.length != todoList_2.length) {
                return false;
            }
            for(let i = 0; i < todoList_1.length; i++) {
                if(!this.todosAreTheSame( todoList_1[i], todoList_2[i])) {
                    return false
                }
            }
            return true;
        }
        return false;
    }
}