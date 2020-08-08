import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/Todo.model';
import { take, map, exhaustMap } from 'rxjs/operators';
import { TodoCategoryPipe } from 'src/app/custom-pipes/todo-category.pipe';
import { TodoStatusPipe } from 'src/app/custom-pipes/todo-status.pipe';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromTodosActions from '../store/todos.actions';
import * as fromTodosReducer from '../store/todos.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {

  todos: Todo[] = [];
  completionStatusFilter: string = '';
  categoryFilter: string[] = [];
  storeSubscription: Subscription;
  
  constructor(
    private todoService: TodoService,
    private store: Store<fromAppReducer.AppState>,
  ) { }

  ngOnInit(): void {

    //this.todos = this.todoService.getTodos();
    // this.todoService.todoListSubject.subscribe(
    //   (todoList: Todo[]) => {
    //     this.todos = todoList;
    //   }
    // )

    this.storeSubscription = this.store.select('todos').pipe(
      map((todosState: fromTodosReducer.State) => {
        console.log('hi')
        return this.todoService.applyTodoFilters(todosState);
      })
    ).subscribe((todos: Todo[]) => {
      this.todos = todos;
    })
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
}
