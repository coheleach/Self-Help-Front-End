import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import * as fromAppReducer from '../store/app.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'})
export class AuthService {

    signOutTimer: any;

    constructor(
        private httpClient: HttpClient, 
        private store: Store<fromAppReducer.AppState>
    ) {}

    prepareUserAutoSignOut(user: User) {
        const millisecondsToSignOut = (user.expirationDateTime.getTime() - new Date().getTime());
        console.log('logging user out in seconds: ' + millisecondsToSignOut / 1000);
        this.signOutTimer = setTimeout(() => {
            this.store.dispatch(new fromAuthActions.AuthSignOut());
        }, millisecondsToSignOut);
    }
}