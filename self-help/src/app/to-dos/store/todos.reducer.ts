import { Todo } from 'src/app/models/Todo.model';
import { SET_TODOS, CLEAR_FILTERS } from './todos.actions';

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
            }
        default:
            return state;
    }
}