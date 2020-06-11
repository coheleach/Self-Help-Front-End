import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-to-dos',
  templateUrl: './to-dos.component.html',
  styleUrls: ['./to-dos.component.css']
})
export class ToDosComponent implements OnInit, OnDestroy {

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.clearAllFilters();
  }

  ngOnDestroy(): void {
    this.todoService.clearAllFilters();
  }

}
