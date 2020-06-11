import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-completion-status',
  templateUrl: './todo-completion-status.component.html',
  styleUrls: ['./todo-completion-status.component.css']
})
export class TodoCompletionStatusComponent implements OnInit {

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
  }

   onClickAny() {
    this.todoService.setCompletionStatusFilter('');
  }

  onClickCompleted() {
    this.todoService.setCompletionStatusFilter('true');
  }

  onClickOutstanding() {
    this.todoService.setCompletionStatusFilter('false');
  }

}
