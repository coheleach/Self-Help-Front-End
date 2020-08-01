import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/Todo.model';
import { take, map, exhaustMap } from 'rxjs/operators';
import { TodoCategoryPipe } from 'src/app/custom-pipes/todo-category.pipe';
import { TodoStatusPipe } from 'src/app/custom-pipes/todo-status.pipe';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos: Todo[] = [];
  completionStatusFilter: string = '';
  categoryFilter: string[] = [];
  
  constructor(private todoService: TodoService) { }

  ngOnInit(): void {

    this.todos = this.todoService.getTodos();
    this.todoService.todoListSubject.subscribe(
      (todoList: Todo[]) => {
        this.todos = todoList;
      }
    )

    console.log(this.todos);
  }
}
