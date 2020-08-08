import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromTodosActions from '../store/todos.actions';

@Component({
  selector: 'app-todo-completion-status',
  templateUrl: './todo-completion-status.component.html',
  styleUrls: ['./todo-completion-status.component.css']
})
export class TodoCompletionStatusComponent implements OnInit {

  constructor(
    private todoService: TodoService,
    private store: Store<fromAppReducer.AppState>
  ) {}

  ngOnInit(): void {
  }

   onClickAny() {
    //this.todoService.setCompletionStatusFilter('');
    this.store.dispatch(new fromTodosActions.SetCompletionStatusFilter(''));
  }

  onClickCompleted() {
    //this.todoService.setCompletionStatusFilter('true');
    this.store.dispatch(new fromTodosActions.SetCompletionStatusFilter('true'));
  }

  onClickOutstanding() {
    //this.todoService.setCompletionStatusFilter('false');
    this.store.dispatch(new fromTodosActions.SetCompletionStatusFilter('false'));
  }

}
