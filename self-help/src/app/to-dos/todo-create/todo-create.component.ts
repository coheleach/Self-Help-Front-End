import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DeactivationComponent } from 'src/app/guards/deactivation-component';
import { Todo } from 'src/app/models/Todo.model';
import { TodoService } from 'src/app/services/todo.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormInputToDateService } from 'src/app/helperServices/form-input-to-date.service';
import { TodoFactoryService } from 'src/app/helperServices/todo-factory.service';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromTodosActions from '../store/todos.actions';
import * as fromTodosReducer from '../store/todos.reducer';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit, OnDestroy, DeactivationComponent {

  form: FormGroup;
  editMode: boolean = false;
  todoId: string;
  subscription: Subscription;

  constructor(
    private todoFactoryService: TodoFactoryService,
    private todoService: TodoService,
    private formHelperService: FormInputToDateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit(): void {
    console.log(this.activatedRoute);
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        console.log('params.id: ' + params['id']);
        console.log(params);
        this.todoId = params['id'];
        if(this.todoId) {
          this.editMode = true;
        }
      }
    );
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    let submittedTodo = new Todo(
      this.todoId,
      this.form.get('title').value,
      this.form.get('description').value,
      this.form.get('category').value,
      this.formHelperService.convertISOStringToDate(this.form.get('deadlineDate').value,'-')      
    );
    if(this.editMode) {
      //this.todoService.updateTodo(submittedTodo);
      this.store.dispatch(new fromTodosActions.UpdateTodo(submittedTodo));
    } else {
      //this.todoService.addTodo(submittedTodo);
      this.store.dispatch(new fromTodosActions.CreateTodo(submittedTodo));
    }
    this.router.navigate(['/','todos']);
  }

  invalidTodoDate(formControl: FormControl): {[key: string]: boolean} {
    //validate that the date isn't in the past
    if(formControl.value == null) { 
      return null; 
    }
    let todoDate = this.formHelperService.convertISOStringToDate(formControl.value, '-');
    let todaysDate = this.formHelperService.clearTimeFromDate(new Date());
    if(todaysDate > todoDate) {
      return { 'historicalDate': true }; 
    }
    return null;
  }

  invalidCategory(formControl: FormControl): {[key: string]: boolean} {
    const acceptableValues = [
      'groceries',
      'travel',
      'meeting',
      'family',
      'maintinence',
      'other'
    ];
    if(acceptableValues.indexOf(formControl.value) == -1) {
      return { 'invalid-category': true };
    }
    return null;
  }

  CanDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    
    if(
        (
          this.form.get('title').value != null 
          ||
          this.form.get('description').value != null
          ||
          this.form.get('deadlineDate').value != null
        )
        &&
        (
          !this.editMode
          &&
          this.form.invalid
        )
      ) {
      return confirm('discard work and leave page?');
    }
    return true;
  }
  
  private initializeForm(): void {
    let title: string = null;
    let category: string = 'groceries';
    let description: string = null;
    let deadlineDate: string = null;

    if(this.editMode) {
      //const todo: Todo = this.todoService.getTodoById(this.todoId);
      this.subscription = this.store.select('todos').pipe(
        take(1),
        map((todosState: fromTodosReducer.State) => {
          return todosState.todos.elements.find(
            (todoElement: Todo) => {
              return todoElement.id == this.todoId;
            }
          )
        })
      ).subscribe((todo: Todo) => {
        title = todo.title;
        category = todo.category;
        description = todo.description;
        //use functions to set date as 'YYYY-MM-DD'
        deadlineDate = todo.deadlineDate.toISOString().substr(0,10);
      })
    }
    
    this.form = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'category': new FormControl(category, [this.invalidCategory.bind(this)]),
      'description': new FormControl(description),
      'deadlineDate': new FormControl(deadlineDate, [Validators.required, this.invalidTodoDate.bind(this)])
    });
  }

}
