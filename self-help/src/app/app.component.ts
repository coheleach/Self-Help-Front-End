import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromAppReducer from './store/app.reducer';
import * as fromAuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'self-help';

  constructor(private authService: AuthService, private store: Store<fromAppReducer.AppState>) { }

  ngOnInit() {
    this.store.dispatch(new fromAuthActions.AuthAutoSignInStart());
    //this.authService.tryAutoSignIn();
  }
}
