import { Todo } from 'src/app/models/Todo.model';
import { SET_TODOS, CLEAR_FILTERS, SET_CATEGORY_FILTERS } from './todos.actions';

export interface State {
    todos: {
        elements: Todo[],
        completionStatusFilter: string,
        categoryFilters: string[]
    }
};

const initialState: State = {
    todos: {
        elements: [],
        completionStatusFilter: '',
        categoryFilters: []
    }
}

export function todosReducer(state: State = initialState, action) {
    switch(action.type) {
        case SET_TODOS:
            return {
                ...state,
                todos: {
                    ...state.todos,
                    elements: action.payload,
                    completionStatusFilter: '',
                    categoryFilters: []
                }
            };
        case CLEAR_FILTERS:
            return {
                ...state,
                todos: {
                    ...state.todos,
                    completionStatusFilter: '',
                    categoryFilters: []
                }
            };
        case SET_CATEGORY_FILTERS:
            return {
                ...state,
                todos: {
                    ...state.todos,
                    categoryFilters: action.payload
                }
            };
        default:
            return state;
    }
}