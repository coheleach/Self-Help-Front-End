import { Todo } from '../models/Todo.model';
import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { FilteredTodoList } from '../models/FilteredTodoList.model';
import { FirebaseStorageService } from './firebase-storage.service';
import { InMemoryTodoRecallService } from '../helperServices/in-memory-todo-recall.service';

@Injectable({providedIn: 'root'})
export class TodoService {

    private filteredTodoList: FilteredTodoList = new FilteredTodoList();

    todoListSubject: Subject<Todo[]> = new Subject<Todo[]>();

    constructor(private firebaseStorageService: FirebaseStorageService,
                private inMemoryTodoRecallService: InMemoryTodoRecallService) {}

    getTodos(): Todo[] {
        return this.filteredTodoList.getTodoList();
    }

    getTodo(index: number): Todo {
        //This method disregards filters
        return this.filteredTodoList.getTodo(index);
    }

    getTodoIndex(soughtTodo: Todo): number {
        return this.filteredTodoList.getTodoList().indexOf(soughtTodo);
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
    }

    removeTodoAtIndex(index: number) {
        this.filteredTodoList.removeTodoAtIndex(index);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
        this.logChangeInLocalStorage();
    }

    removeAllTodos() {
        this.filteredTodoList.removeAllTodos();
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

    revertToLastSavedTodos() {
        this.firebaseStorageService.getAllUsersTodos().subscribe(
            (todoList: Todo[]) => {
                this.updateTodos(todoList);
                this.inMemoryTodoRecallService.removeTodosInLocalStorage();
            }
        )
    }

    saveTodoListChanges() {
        this.firebaseStorageService.putUsersTodos(
            this.inMemoryTodoRecallService.fetchTodosFromLocalStorage()
        ).subscribe(response => {
            console.log(response);
            this.inMemoryTodoRecallService.removeTodosInLocalStorage();
        }, error => {
            alert('unable to save todo list');
            console.log(error);
        });
    }

    //only call below method on crud operations
    //triggered by the user.
    private logChangeInLocalStorage() {
        this.inMemoryTodoRecallService.logTodosInLocalStorage(
            this.getTodos()
        );
    }
}