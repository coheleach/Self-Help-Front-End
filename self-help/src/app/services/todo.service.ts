import { Todo } from '../models/Todo.model';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { FilteredTodoList } from '../models/FilteredTodoList.model';
import { AuthService } from '../auth/auth.service';
import { FirebaseStorageService } from './firebase-storage.service';
import { InMemoryTodoRecallService } from '../helperServices/in-memory-todo-recall.service';

@Injectable({providedIn: 'root'})
export class TodoService {

    private filteredTodoList: FilteredTodoList = new FilteredTodoList();

    todoListSubject: Subject<Todo[]> = new Subject<Todo[]>();

    constructor(private authService: AuthService, 
                private firebaseStorageService: FirebaseStorageService,
                private inMemoryTodoRecallService: InMemoryTodoRecallService) {
        authService.user.subscribe(user => {
            if(!user) {
                this.removeAllTodos();
            } else {
                this.firebaseStorageService.getAllUsersTodos().subscribe((todoList: Todo[]) => {
                    this.updateTodos(todoList);
                });
            }
        })
    }

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
        this.logChangeInLocalStorage();
    }

    updateTodo(index: number, todo: Todo) {
        this.filteredTodoList.updateTodo(index, todo);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
        this.logChangeInLocalStorage();
    }

    updateTodos(todos: Todo[]) {
        this.filteredTodoList.updateTodos(todos);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
        this.logChangeInLocalStorage();
    }

    removeTodoAtIndex(index: number) {
        this.filteredTodoList.removeTodoAtIndex(index);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
        this.logChangeInLocalStorage();
    }

    removeAllTodos() {
        this.filteredTodoList.removeAllTodos();
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
        this.logChangeInLocalStorage()
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

    private logChangeInLocalStorage() {
        this.inMemoryTodoRecallService.logUnsavedEdit();
        this.inMemoryTodoRecallService.logTodosInLocalStorage(this.getTodos());
    }
}