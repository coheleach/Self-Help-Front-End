import { Action } from '@ngrx/store';
import { User } from '../../models/User.model';

export const AUTH_SIGN_IN = '[Auth] Sign In';
export const AUTH_SIGN_OUT = '[Auth] Sign Out';

export class AuthLogin implements Action {
    readonly type: string = AUTH_SIGN_IN;

    constructor(public payload: {user: User}) {}
}

export class AuthLogout implements Action {
    readonly type: string = AUTH_SIGN_OUT;
}



