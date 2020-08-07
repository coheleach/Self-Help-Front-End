import { Action } from '@ngrx/store';
import { Todo } from 'src/app/models/Todo.model';

export const SET_TODOS = '[Todos] Set Todos';

export class SetTodos implements Action {
    readonly type: string = SET_TODOS;

    constructor(public payload: Todo[]) {}
}