import { getuid } from 'process';

export class Todo {

    constructor(
        public id: string,
        public title: string,
        public description: string,
        public category: string,
        public deadlineDate: Date,
        public creationDate?: Date,
        public completed?: boolean) {
        
        if(!creationDate) {
            this.creationDate = new Date()
        }

        if(completed == null) {
            this.completed = false;
        }
    }

    public todoWithoutId(todo: Todo): TodoWithoutId {
        return TodoWithoutId.convert(todo);
    }
        
}

//This class is used to store
//todos in firebase without 
//in memory generated ids
export class TodoWithoutId {

    constructor(
    public title: string,
    public description: string,
    public category: string,
    public deadLineDate: Date,
    public creationDate: Date,
    public completed: boolean,
    ) {}
    
    public static convert(todo: Todo): TodoWithoutId {
        return new TodoWithoutId(
            todo.title,
            todo.description,
            todo.category,
            todo.deadlineDate,
            todo.creationDate,
            todo.completed
        );
    }

    public static convertArray(todoList: Todo[]): TodoWithoutId[] {
        let todoWithoutIdList: TodoWithoutId[] = [];
        for(let todo of todoList) {
            todoWithoutIdList.push(TodoWithoutId.convert(todo));
        }
        return todoWithoutIdList;
    }
}