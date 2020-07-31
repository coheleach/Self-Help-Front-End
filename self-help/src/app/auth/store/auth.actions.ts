import { Action } from '@ngrx/store';
import { User } from '../../models/User.model';

export const AUTH_REQUEST_SIGN_UP = '[Auth] Rrequest Sign Up';
export const AUTH_REQUEST_SIGN_UP_DENIED = '[Auth] Request Sign Up Denied';
export const AUTH_SIGN_IN = '[Auth] Sign In';
export const AUTH_REQUEST_SIGN_IN = '[Auth] Request Sign In';
export const AUTH_REQUEST_SIGN_IN_DENIED = '[Auth] Request Sign In Denied';
export const AUTH_SIGN_OUT = '[Auth] Sign Out';
export const AUTH_AUTO_SIGN_IN_START = '[Auth] Auto Sign In Start';
export const AUTH_AUTO_SIGN_IN_FAIL = '[Auth] Auto Sign In Fail';

export class AuthRequestSignUp implements Action {
    readonly type: string = AUTH_REQUEST_SIGN_UP;

    constructor(
        public payload: 
        {
            email: string,
            password: string
        }
    ) {}
}

export class AuthRequestSignUpDenied implements Action {
    readonly type: string = AUTH_REQUEST_SIGN_UP_DENIED;

    constructor(public payload: string) {}
}

export class AuthSignIn implements Action {
    readonly type: string = AUTH_SIGN_IN;

    constructor(public payload: User) {}
}

export class AuthRequestSignIn implements Action {
    readonly type: string = AUTH_REQUEST_SIGN_IN;

    constructor(
        public payload: 
        {
            email: string, 
            password: string
        }
    ) {}
}

export class AuthRequestSigninDenied {
    readonly type: string = AUTH_REQUEST_SIGN_IN_DENIED;
    
    constructor(public payload: string) {}
}

export class AuthSignOut implements Action {
    readonly type: string = AUTH_SIGN_OUT;
}

export class AuthAutoSignInStart implements Action {
    readonly type: string = AUTH_AUTO_SIGN_IN_START;
}

export class AuthAutoSignInFail implements Action {
    readonly type: string = AUTH_AUTO_SIGN_IN_FAIL;
}

