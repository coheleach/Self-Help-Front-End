import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  constructor(private store: Store<fromAppReducer.AppState>) { }

  ngOnInit(): void {
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
