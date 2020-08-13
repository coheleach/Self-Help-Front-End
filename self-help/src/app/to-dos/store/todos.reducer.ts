import { Todo } from 'src/app/models/Todo.model';
import { SET_TODOS, CLEAR_FILTERS, SET_CATEGORY_FILTERS, SET_COMPLETION_STATUS_FILTER, CREATE_TODO } from './todos.actions';
import { element } from 'protractor';

export interface State {
    todos: {
        elements: Todo[],
        completionStatusFilter: string,
        categoryFilters: string[],
        inMemoryTempId: number
    }
};

const initialState: State = {
    todos: {
        elements: [],
        completionStatusFilter: '',
        categoryFilters: [],
        inMemoryTempId: 1
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
        case CREATE_TODO:
            //bugfix function below
            //to handle todos without
            //id because they didn't
            //exist in firebase.  They
            //have been created in
            //memory only
            
            let todoWithMakeshiftId: Todo = {
                ...action.payload,
                id: state.todos.inMemoryTempId
            };
            
            ///////////////////////////
            return {
                ...state,
                todos: {
                    ...state.todos,
                    elements: [...state.todos.elements, todoWithMakeshiftId],
                    inMemoryTempId: (state.todos.inMemoryTempId + 1)
                }
            }
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
        case SET_COMPLETION_STATUS_FILTER:
            return {
                ...state,
                todos: {
                    ...state.todos,
                    completionStatusFilter: action.payload
                }
            }
        default:
            return state;
    }
}