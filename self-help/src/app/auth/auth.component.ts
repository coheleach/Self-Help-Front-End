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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    
  }

  onSubmit() {

    if(!this.loginMode) {  
      this.authService.signUp(
        this.form.controls['email'].value,
        this.form.controls['password'].value
      );
    } else {
      this.authService.signIn(
        this.form.controls['email'].value,
        this.form.controls['password'].value
      );
    }
  }

  toggleLoginMode() {
    this.loginMode = !this.loginMode;
  }

}
