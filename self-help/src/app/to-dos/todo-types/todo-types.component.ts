import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Subscription } from 'rxjs';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromTodosActions from '../store/todos.actions';
import * as fromTodosReducer from '../store/todos.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-todo-types',
  templateUrl: './todo-types.component.html',
  styleUrls: ['./todo-types.component.css']
})
export class TodoTypesComponent implements OnInit, OnDestroy {

  @ViewChild('list_group') listGroup: ElementRef;
  categoryArray: string[] = [];

  constructor(
    private todoService: TodoService,
    private store: Store<fromAppReducer.AppState> 
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // this.todoService.clearAllFilters();
    this.store.dispatch(new fromTodosActions.ClearFilters());
  }

  onClickCategory(category: string) {
    if(this.categoryArray.includes(category)) {
      const index = this.categoryArray.indexOf(category);
      this.categoryArray.splice(index, 1);
    } else {
      this.categoryArray.push(category);
    }
    // this.todoService.setCategoryFilter(this.categoryArray);
    this.store.dispatch(new fromTodosActions.SetCategoryFilters([...this.categoryArray]));
  }
}
