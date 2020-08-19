import { Action } from '@ngrx/store';
import { Todo } from 'src/app/models/Todo.model';

export const SET_TODOS = '[Todos] Set Todos';
export const CLEAR_FILTERS = '[Todos] Clear Filters';
export const SET_CATEGORY_FILTERS = '[Todos] Set Category Filters';
export const SET_COMPLETION_STATUS_FILTER = '[Todos] Set Completion Status Filter';
export const FETCH_TODOS = '[Todos] Fetch Todos';
export const CREATE_TODO = '[Todos] Create Todo';
export const UPDATE_TODO = '[Todos] Update Todo';
export const LOG_TODO_CHANGES = '[Todos] Log Todo Changes';
export const REVERT_TODOS_LAST_CHANGED = '[Todos] Revert Todos Last Saved';

export class SetTodos implements Action {
    readonly type: string = SET_TODOS;

    constructor(public payload: { todos: Todo[], fromFirebase: boolean}) {}
}

export class FetchTodos implements Action {
    readonly type: string = FETCH_TODOS;
}

export class CreateTodo implements Action {
    readonly type: string = CREATE_TODO;

    constructor(public payload: Todo) {}
}

export class UpdateTodo implements Action {
    readonly type: string = UPDATE_TODO;

    constructor(public payload: Todo) {}
}

export class RevertTodosLastSaved implements Action {
    readonly type: string = REVERT_TODOS_LAST_CHANGED;
}

export class ClearFilters implements Action {
    readonly type: string = CLEAR_FILTERS;
}

export class SetCategoryFilters implements Action {
    readonly type: string = SET_CATEGORY_FILTERS;

    constructor(public payload: string[]) {}
}

export class SetCompletionStatusFilter implements Action {
    readonly type: string = SET_COMPLETION_STATUS_FILTER;

    constructor(public payload: string) {}
}

export class LogTodoInLocalStorage implements Action {
    readonly type: string = LOG_TODO_CHANGES;
}