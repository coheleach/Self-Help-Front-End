import { Todo } from './Todo.model';

export class FilteredTodoList {

    private todos: Todo[] = [];
    private completionStatusFilter: string = '';
    private categoryFilter: string[];

    constructor(todos?: Todo[]) {
        if(this.todos) {
            this.todos = todos;
        }
    }
    
    getTodoList(): Todo[] {
        return this.todos.slice();
    }

    getTodo(index: number): Todo {
        return this.todos[index];
    }

    addTodo(newTodo: Todo) {
        this.todos.push(newTodo);
    }

    updateTodo(index: number, todo: Todo) {
        this.todos[index] = todo;
    }

    removeTodoAtIndex(index: number) {
        this.todos.splice(index, 1);
    }

    getFilteredTodoList() {
        return this.applyTodoFilters(this.todos);
    }

    setCompletionStatusFilter(status: string) {
        this.completionStatusFilter = status;
    }

    setCategoryFilter(category: string[]) {
        this.categoryFilter = category;
    }

    clearAllFilters() {
        this.completionStatusFilter = '';
        this.categoryFilter = [];
    }

    applyTodoFilters(todos: Todo[]): Todo[] {
        todos = this.applyCategoryFilter(todos);
        todos = this.applyCompletionStatusFilter(todos);
        return todos;
    }

    private applyCategoryFilter(todos: Todo[]): Todo[] {
        let filteredArray: Todo[] = [];
        if(this.categoryFilter.length == 0) {
            return todos;
        }
        for(let todo of todos) {
            if(this.categoryFilter.includes(todo.category)) {
                filteredArray.push(todo);
            }
        }
        return filteredArray;
    }

    private applyCompletionStatusFilter(todos: Todo[]): Todo[] {
        let filteredArray: Todo[] = [];
        if(this.completionStatusFilter == '') {
            return todos;
        }
        for(let todo of todos) {
            if(String(todo.completed) == this.completionStatusFilter) {
                filteredArray.push(todo);
           }
        }
        return filteredArray;
    }
}