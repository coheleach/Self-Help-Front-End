import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { Todo } from '../models/Todo.model';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../store/app.reducer';
import * as fromAuthReducer from '../auth/store/auth.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';

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

  constructor(
    private authService: AuthService,
    private firebaseStorageService: FirebaseStorageService,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit(): void {
    // this.subscription = this.authService.user.subscribe((user: User) => {
    //   console.log('user logged in: ' + user);
    // });
    this.subscription = this.store.select('auth').subscribe(
      (authState: fromAuthReducer.State) => {
        this.error = authState.authErrorMessage
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if(!this.loginMode) {  
      // this.authService.signUp(
      //   this.form.controls['email'].value,
      //   this.form.controls['password'].value
      // ).subscribe(response => {
      //   this.error = null
      // }, error => {
      //   this.error = error
      //   console.log(error);
      // });
      this.store.dispatch(
        new fromAuthActions.AuthRequestSignUp({
          email: this.form.controls['email'].value,
          password: this.form.controls['password'].value
      }));
    } else {
      this.store.dispatch(
        new fromAuthActions.AuthRequestSignIn({
          email: this.form.controls['email'].value,
          password: this.form.controls['password'].value
        }));
    }
  }

  toggleLoginMode() {
    this.loginMode = !this.loginMode;
  }

}
