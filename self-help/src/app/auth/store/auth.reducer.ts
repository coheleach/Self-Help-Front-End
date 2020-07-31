import { AUTH_SIGN_IN, AUTH_SIGN_OUT, AUTH_REQUEST_SIGN_IN, AUTH_REQUEST_SIGN_IN_DENIED, AUTH_REQUEST_SIGN_UP, AUTH_REQUEST_SIGN_UP_DENIED, AUTH_AUTO_SIGN_IN_START, AUTH_AUTO_SIGN_IN_FAIL } from './auth.actions';
import { User } from '../../models/User.model';
import { SignInMethod } from '../../enums/sign-in-method.enum';

const initialState = { 
    user: null, 
    signInMethod: SignInMethod.none,
    authErrorMessage: null
};

export interface State {
    user: User,
    signInMethod: SignInMethod,
    authErrorMessage: string
};

export function authReducer(state: State = initialState, action) {
    switch(action.type) {
        case AUTH_REQUEST_SIGN_UP:
            return {
                ...state,
                signInMethod: SignInMethod.signUp
            }
        case AUTH_REQUEST_SIGN_IN:
            return {
                ...state,
                signInMethod: SignInMethod.manual,
                authErrorMessage: null
            }
        case AUTH_SIGN_IN:
            return {
                ...state,
                user: action.payload,
                authErrorMessage: null
            }
        case AUTH_SIGN_OUT:
            return {
                ...state,
                user: null,
                signInMethod: SignInMethod.none,
                authErrorMessage: null
            }
        case AUTH_REQUEST_SIGN_IN_DENIED:
            return {
                ...state,
                signInMethod: SignInMethod.none,
                authErrorMessage: action.payload
            }
        case AUTH_REQUEST_SIGN_UP_DENIED:
            return {
                ...state,
                signInMethod: SignInMethod.none,
                authErrorMessage: action.payload
            }
        case AUTH_AUTO_SIGN_IN_START:
            return {
                ...state,
                signInMethod: SignInMethod.auto,
            }
        case AUTH_AUTO_SIGN_IN_FAIL:
            return {
                ...state,
                signInMethod: SignInMethod.none
            }
        default:
            return state;
    }
}