import { ActionReducerMap } from '@ngrx/store';
import * as fromAuthReducer from '../auth/store/auth.reducer'

export interface AppState {
   auth: fromAuthReducer.State
}

export const appReducer: ActionReducerMap<AppState> = {
    
    auth: fromAuthReducer.authReducer
}