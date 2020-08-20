import { Component, OnInit, Input } from '@angular/core';
import { Todo, TodoWithoutId } from 'src/app/models/Todo.model';
import { TodoService } from 'src/app/services/todo.service';
import * as fromAppReducer from '../../../store/app.reducer';
import * as fromTodoActions from '../../store/todos.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {

  @Input('todo') todo: Todo;
  
  constructor(
    private todoService: TodoService,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit(): void {
  }

  onComplete(): void {
    let alteredTodo = new Todo(
      this.todo.id,
      this.todo.title,
      this.todo.description,
      this.todo.description,
      this.todo.deadlineDate,
      this.todo.creationDate,
      true //don't forget to reverse the completion status
    );
    //this.todoService.updateTodo(this.todo);
    this.store.dispatch(new fromTodoActions.UpdateTodo(alteredTodo));
  }

  onRemove(): void {
    //this.todoService.removeTodoById(this.todo.id);
    this.store.dispatch(new fromTodoActions.DeleteTodo(this.todo.id));
  }

}
