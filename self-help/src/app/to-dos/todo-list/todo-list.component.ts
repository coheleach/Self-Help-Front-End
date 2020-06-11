import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/Todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos: Todo[] = [];
  completionFilterStatus: string;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.completionFilterStatus = 'false';
    this.todos = this.todoService.getTodos();
    //console.log(this.todos);
  }

  onClickAny() {
    this.completionFilterStatus = '';
  }

  onClickCompleted() {
    this.completionFilterStatus = 'true';
  }

  onClickOutstanding() {
    this.completionFilterStatus = 'false';
  }

}
