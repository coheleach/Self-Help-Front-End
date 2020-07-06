import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { Todo } from '../models/Todo.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  @ViewChild('form') form: NgForm;
  subscription: Subscription;
  loginMode: boolean = true;
  error: string = null;

  constructor(private authService: AuthService,
    private firebaseStorageService: FirebaseStorageService) { }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe((user: User) => {
      console.log('user logged in: ' + user);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {

    if(!this.loginMode) {  
      this.authService.signUp(
        this.form.controls['email'].value,
        this.form.controls['password'].value
      ).subscribe(response => {
        this.error = null
      }, error => {
        this.error = error
        console.log(error);
      });
    } else {
      this.authService.signIn(
        this.form.controls['email'].value,
        this.form.controls['password'].value
      ).subscribe(
        response => {
          this.error = null;
        },error => {
          this.error = error;
          console.log(error);
        }
      );
    }
  }

  toggleLoginMode() {
    this.loginMode = !this.loginMode;
  }

}
