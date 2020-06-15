import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit {

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
    console.log(this.form.get('deadlineDate').errors);
    console.log(this.form.get('deadlineDate').touched);
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

}
