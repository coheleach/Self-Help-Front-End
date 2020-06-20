import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  loginMode: boolean = true;

  constructor() { }

  ngOnInit(): void {
    
  }

  onSubmit() {
    console.log(this.form);
  }

  toggleLoginMode() {
    this.loginMode = !this.loginMode;
  }

}
