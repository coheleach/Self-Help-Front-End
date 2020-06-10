import { PipeTransform, Pipe } from '@angular/core';
import { Todo } from '../models/Todo.model';

@Pipe({
    name: 'todoFilter'
})
export class TodoStatusPipe implements PipeTransform {

    transform(todos: Todo[], property: string, desiredValue: string) {
        let filteredArray: Todo[] = [];
        for(const todo of todos) {
            console.log(todo[property]);
            if(todo[property] == desiredValue) {
                filteredArray.push(todo);
            }
        }
        return filteredArray;
    }
}