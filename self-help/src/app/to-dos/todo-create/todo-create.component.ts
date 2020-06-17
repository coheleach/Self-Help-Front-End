import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DeactivationComponent } from 'src/app/guards/deactivation-component';
import { Todo } from 'src/app/models/Todo.model';
import { TodoService } from 'src/app/services/todo.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit, DeactivationComponent {

  form: FormGroup;
  editMode: boolean = false;
  todoIndex: number;

  constructor(
    private todoService: TodoService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.todoIndex = params['index'];
        if(this.todoIndex) {
          this.editMode = true;
        }
      }
    );
    this.initializeForm();
  }

  onSubmit(): void {
    const submittedTodo = new Todo(
      this.form.get('title').value,
      this.form.get('description').value,
      this.form.get('category').value,
      this.form.get('deadlineDate').value      
    );
    if(this.editMode) {
      this.todoService.updateTodo(this.todoIndex ,submittedTodo);
    } else {
      this.todoService.addTodo(submittedTodo);
    }
    this.router.navigate(['/','todos']);
  }

  invalidTodoDate(formControl: FormControl): {[key: string]: boolean} {
    //validate that the date isn't in the past
    if(formControl.value == null) { 
      return null; 
    }
    //we instantiate custom Dates of format
    //YYYY-MM-DD so that we can 
    //neglect time in the date comparison
    const todoDate_YearMonthDay = formControl.value.split('-');
    let todoDate = new Date(
      todoDate_YearMonthDay[0],
      (+todoDate_YearMonthDay[1] - 1),
      todoDate_YearMonthDay[2]
    );
    let todaysDate = new Date();
    todaysDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
    if(todaysDate > todoDate) {
      return { 'historicalDate': true }; 
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
      const todo: Todo = this.todoService.getTodo(this.todoIndex);
      title = todo.title;
      category = todo.category;
      description = todo.description;
      //use functions to set date as 'YYY-MM-DD'
      deadlineDate = todo.deadlineDate.toISOString().substr(0,10);
    }
    
    this.form = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'category': new FormControl(category),
      'description': new FormControl(description),
      'deadlineDate': new FormControl(deadlineDate, [Validators.required, this.invalidTodoDate.bind(this)])
    });
  }

}
