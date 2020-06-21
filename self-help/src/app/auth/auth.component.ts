import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  loginMode: boolean = true;
  error: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    
  }

  onSubmit() {

    if(!this.loginMode) {  
      this.authService.signUp(
        this.form.controls['email'].value,
        this.form.controls['password'].value
      ).subscribe(
        response => {this.error = null},
        error => {this.error = error}
      );
    } else {
      this.authService.signIn(
        this.form.controls['email'].value,
        this.form.controls['password'].value
      ).subscribe(
        response => {this.error = null;},
        error => {this.error = error;}
      );
    }
  }

  toggleLoginMode() {
    this.loginMode = !this.loginMode;
  }

}
