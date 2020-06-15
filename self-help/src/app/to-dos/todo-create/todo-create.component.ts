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
      'deadlineDate': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    console.log(this.form);
  }

}
