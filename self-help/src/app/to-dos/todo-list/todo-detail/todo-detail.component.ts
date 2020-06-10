import { Component, OnInit, Input } from '@angular/core';
import { Todo } from 'src/app/models/Todo.model';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {

  @Input('todo') todo: Todo;
  @Input('todo-index') index: number;
  
  constructor() { }

  ngOnInit(): void {
  }


}
