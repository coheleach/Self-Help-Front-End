import { Todo } from '../models/Todo.model';
import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { FilteredTodoList } from '../models/FilteredTodoList.model';
import { FirebaseStorageService } from './firebase-storage.service';
import { InMemoryTodoRecallService } from '../helperServices/in-memory-todo-recall.service';
import * as fromTodosReducer from '../to-dos/store/todos.reducer'; 

@Injectable({providedIn: 'root'})
export class TodoService {

    private filteredTodoList: FilteredTodoList = new FilteredTodoList();

    todoListSubject: Subject<Todo[]> = new Subject<Todo[]>();

    constructor(
        private firebaseStorageService: FirebaseStorageService,
        private inMemoryTodoRecallService: InMemoryTodoRecallService
    ) {}

    getTodos(): Todo[] {
        return this.filteredTodoList.getTodoList();
    }

    getTodoById(id: string): Todo {
        //This method disregards filters
        return this.filteredTodoList.getTodoById(id);
    }

    // getTodoIndex(soughtTodo: Todo): number {
    //     return this.filteredTodoList.getTodoList().indexOf(soughtTodo);
    // }

    // addTodo(newTodo: Todo) {
    //     this.filteredTodoList.addTodo(newTodo);
    //     this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    //     this.logChangeInLocalStorage();
    // }

    updateTodo(todo: Todo) {
        this.filteredTodoList.updateTodo(todo);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
        this.logChangeInLocalStorage();
    }

    updateTodos(todos: Todo[]) {
        this.filteredTodoList.updateTodos(todos);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    }

    removeTodoById(id: string) {
        this.filteredTodoList.removeTodoById(id);
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
        this.logChangeInLocalStorage();
    }

    removeAllTodos() {
        this.filteredTodoList.removeAllTodos();
        this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    }

    // setCompletionStatusFilter(status: string) {
    //     this.filteredTodoList.setCompletionStatusFilter(status);
    //     this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    // }

    // setCategoryFilter(category: string[]) {
    //     this.filteredTodoList.setCategoryFilter(category);
    //     this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    // }

    // clearAllFilters() {
    //     this.filteredTodoList.clearAllFilters();
    //     this.todoListSubject.next(this.filteredTodoList.getFilteredTodoList());
    // }

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














    applyTodoFilters(todosState: fromTodosReducer.State): Todo[] {
        let todos: Todo[] = todosState.todos.elements.slice();
        //console.log('original todos: ' + todosState.todos.elements);
        todos = this.applyCategoryFilter(todos, todosState.todos.categoryFilters);
        //console.log('todos after category filter: ' + todos);
        todos = this.applyCompletionStatusFilter(todos, todosState.todos.completionStatusFilter);
        //console.log('todos after status filter ' + todos);
        return todos;
    }

    private applyCategoryFilter(todos: Todo[], categoryFilters: string[]): Todo[] {
        let filteredArray: Todo[] = [];
        if(categoryFilters.length == 0) {
            return todos;
        }
        for(let todo of todos) {
            if(categoryFilters.includes(todo.category)) {
                filteredArray.push(todo);
            }
        }
        return filteredArray;
    }

    private applyCompletionStatusFilter(todos: Todo[], completionStatusFilter: string): Todo[] {
        let filteredArray: Todo[] = [];
        if(completionStatusFilter == '') {
            return todos;
        }
        for(let todo of todos) {
            if(String(todo.completed) == completionStatusFilter) {
                filteredArray.push(todo);
           }
        }
        return filteredArray;
    }
}