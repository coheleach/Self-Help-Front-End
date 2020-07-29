import { AUTH_SIGN_IN, AUTH_SIGN_OUT } from './auth.actions';
import { User } from '../../models/User.model';
import { SignInMethod } from '../../enums/sign-in-method.enum';

const initialState = { user: null, signInMethod: SignInMethod.none };

export interface State {
    user: User,
    signInMethod: SignInMethod
};

export function authReducer(state: State = initialState, action) {
    switch(action) {
        case AUTH_SIGN_IN:
            return {
                ...state,
                user: action.payload.user,
                signInMethod: SignInMethod.manual
            }
        case AUTH_SIGN_OUT:
            return {
                ...state,
                user: null,
                signInMethod: SignInMethod.none
            }
        default:
            return state;
    }
}