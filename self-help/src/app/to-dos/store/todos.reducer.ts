import { Todo } from 'src/app/models/Todo.model';
import { SET_TODOS, CLEAR_FILTERS, SET_CATEGORY_FILTERS, SET_COMPLETION_STATUS_FILTER, CREATE_TODO, UPDATE_TODO, DELETE_TODO } from './todos.actions';

export interface State {
    todos: {
        elements: Todo[],
        completionStatusFilter: string,
        categoryFilters: string[],
        inMemoryTempId: number,
        lastFetchedTodos: Todo[]
    }
};

const initialState: State = {
    todos: {
        elements: [],
        completionStatusFilter: '',
        categoryFilters: [],
        inMemoryTempId: 1,
        lastFetchedTodos: []
    }
}

export function todosReducer(state: State = initialState, action) {
    switch(action.type) {
        case SET_TODOS:
            return {
                ...state,
                todos: {
                    ...state.todos,
                    elements: [ ...action.payload.todos ],
                    completionStatusFilter: '',
                    categoryFilters: [],
                    lastFetchedTodos: action.payload.fromFirebase ? action.payload.todos : [ ...state.todos.lastFetchedTodos ]
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
            };
        case UPDATE_TODO:
            let updateIndex: number = [...state.todos.elements].findIndex((todo, index) => {
                return todo.id == action.payload.id
            });
            let updatedElementsArray: Todo[] = [...state.todos.elements];
            updatedElementsArray[updateIndex] = action.payload;
            return {
                ...state,
                todos: {
                    ...state.todos,
                    elements: updatedElementsArray
                }
            };
        case DELETE_TODO:
            let alteredElementsArray: Todo[] = [...state.todos.elements].filter((todo: Todo) => {
                return todo.id != action.payload
            });
            return {
                ...state,
                todos: {
                    ...state.todos,
                    elements: alteredElementsArray
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