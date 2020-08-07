import { ActionReducerMap } from '@ngrx/store';
import * as fromAuthReducer from '../auth/store/auth.reducer'
import * as fromTodosReducer from '../to-dos/store/todos.reducer';

export interface AppState {
   auth: fromAuthReducer.State,
   todos: fromTodosReducer.State
}

export const appReducer: ActionReducerMap<AppState> = {
    
    auth: fromAuthReducer.authReducer,
    todos: fromTodosReducer.todosReducer
}