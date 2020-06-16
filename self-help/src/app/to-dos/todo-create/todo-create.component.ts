import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DeactivationComponent } from 'src/app/guards/deactivation-component';
import { Todo } from 'src/app/models/Todo.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit, DeactivationComponent {

  form: FormGroup;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'category': new FormControl('groceries'),
      'description': new FormControl(null),
      'deadlineDate': new FormControl(null, [Validators.required, this.invalidTodoDate.bind(this)])
    })
  }

  onSubmit() {
    this.todoService.addTodo(
      new Todo(
        this.form.get('title').value,
        this.form.get('description').value,
        this.form.get('category').value,
        this.form.get('deadlineDate').value,
      )
    );
  }

  invalidTodoDate(formControl: FormControl): {[key: string]: boolean} {
    //validate that the date isn't in the past
    if(formControl.value == null)
    { return null; }
    let todoDate = new Date(formControl.value);
    let todaysDate = new Date();
    if(todaysDate > todoDate) {
      return { 'historicalDate': true }; 
    }
    return null;
  }

  CanDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log('invoking can deactivate');
    if(
        this.form.get('title').value != null 
        ||
        this.form.get('description').value != null
        ||
        this.form.get('deadlineDate').value != null
      ) {
      return confirm('discard work and leave page?');
    }
    return true;
  }
  

}
