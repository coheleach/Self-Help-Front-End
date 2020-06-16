import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DeactivationComponent } from 'src/app/guards/deactivation-component';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit, DeactivationComponent {

  form: FormGroup;

  constructor() { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'category': new FormControl('groceries'),
      'description': new FormControl(null),
      'deadlineDate': new FormControl(null, [Validators.required, this.invalidTodoDate.bind(this)])
    })
  }

  onSubmit() {
    // console.log(this.form.get('deadlineDate').errors);
    // console.log(this.form.get('deadlineDate').touched);
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
    if(this.form.get('title').dirty ||
       this.form.get('description').dirty ||
       this.form.get('deadLineDate').dirty) {
      return confirm('discard work and leave page?');
    }
    return true;
  }
  

}
