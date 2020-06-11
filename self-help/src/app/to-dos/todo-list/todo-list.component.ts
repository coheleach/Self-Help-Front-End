import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/Todo.model';
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

    this.todoService.categoryFilter.subscribe((categories: string[]) => {
      this.categoryFilter = categories;
      this.todos = this.applyTodoFilters(this.todoService.getTodos());
    },
    error => {
      alert('[Error{ [component: TodoList, source: todoService.categoryFilter.subscribe(...): ] }');
      console.log(error);
    });

    this.todoService.completionStatusFilter.subscribe(status => {
      this.completionStatusFilter = status;
      this.todos = this.applyTodoFilters(this.todoService.getTodos());
    },
    error => { 
      alert('[Error{ [component: TodoList, source: todoService.completionStatusFilter.subscribe(...): ] }');
      console.log(error);
    });
  }

  applyTodoFilters(todos: Todo[]): Todo[] {
    todos = this.applyCategoryFilter(todos);
    todos = this.applyCompletionStatusFilter(todos);
    return todos;
  }

  private applyCategoryFilter(todos: Todo[]): Todo[] {
    let filteredArray: Todo[] = [];
    if(this.categoryFilter.length == 0) {
      return todos;
    }
    for(let todo of todos) {
      if(this.categoryFilter.includes(todo.category)) {
        filteredArray.push(todo);
      }
    }
    return filteredArray;
  }

  private applyCompletionStatusFilter(todos: Todo[]): Todo[] {
    let filteredArray: Todo[] = [];
    if(this.completionStatusFilter == '') {
      return todos;
    }
    for(let todo of todos) {
      if(String(todo.completed) == this.completionStatusFilter) {
        filteredArray.push(todo);
      }
    }
    return filteredArray;
  }
}
