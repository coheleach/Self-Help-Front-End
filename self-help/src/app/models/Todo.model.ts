import { getuid } from 'process';

export class Todo {


    constructor(
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
        
}