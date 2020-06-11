import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-types',
  templateUrl: './todo-types.component.html',
  styleUrls: ['./todo-types.component.css']
})
export class TodoTypesComponent implements OnInit, OnDestroy {

  @ViewChild('list_group') listGroup: ElementRef;
  categoryArray: string[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.todoService.clearAllFilters();
  }

  onClickCategory(category: string) {
    if(this.categoryArray.includes(category)) {
      const index = this.categoryArray.indexOf(category);
      this.categoryArray.splice(index, 1);
    } else {
      this.categoryArray.push(category);
    }

    this.todoService.setCategoryFilter(this.categoryArray);
  }
}
