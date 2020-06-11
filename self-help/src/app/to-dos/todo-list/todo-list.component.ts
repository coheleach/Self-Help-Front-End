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
  completionStatusFilter: string = '';
  categoryFilter: string = '';
  
  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todos = this.todoService.getTodos();

    this.todoService.categoryFilter.subscribe(category => {
      this.categoryFilter = category;
    },
    error => {
      alert('[Error{ [component: TodoList, source: todoService.categoryFilter.subscribe(...): ] }');
      console.log(error);
    });

    this.todoService.completionStatusFilter.subscribe(status => {
      this.completionStatusFilter = status;
    },
    error => { 
      alert('[Error{ [component: TodoList, source: todoService.completionStatusFilter.subscribe(...): ] }');
      console.log(error);
    });
  }
}
