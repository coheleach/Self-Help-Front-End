import { Action } from '@ngrx/store';
import { Todo } from 'src/app/models/Todo.model';

export const SET_TODOS = '[Todos] Set Todos';
export const CLEAR_FILTERS = '[Todos] Clear Filters';
export const SET_CATEGORY_FILTERS = '[Todos] Set Category Filters';

export class SetTodos implements Action {
    readonly type: string = SET_TODOS;

    constructor(public payload: Todo[]) {}
}

export class ClearFilters implements Action {
    readonly type: string = CLEAR_FILTERS;
}

export class SetCategoryFilters implements Action {
    readonly type: string = SET_CATEGORY_FILTERS;

    constructor(public payload: string[]) {}
}