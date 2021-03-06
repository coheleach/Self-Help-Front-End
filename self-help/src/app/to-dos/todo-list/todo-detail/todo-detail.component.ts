import { Component, OnInit, Input } from '@angular/core';
import { Todo } from 'src/app/models/Todo.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {

  @Input('todo') todo: Todo;
  
  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  onComplete(): void {
    this.todo.completed = !this.todo.completed;
    this.todoService.updateTodo(this.todo);
  }

  onRemove(): void {
    this.todoService.removeTodoById(this.todo.id);
  }

}
