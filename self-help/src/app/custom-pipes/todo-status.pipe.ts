import { PipeTransform, Pipe } from '@angular/core';
import { Todo } from '../models/Todo.model';

@Pipe({
    name: 'todoFilter'
})
export class TodoStatusPipe implements PipeTransform {

    transform(todos: Todo[], property: string, desiredValue: string) {
        let filteredArray: Todo[] = [];

        if(desiredValue == '') {
            return todos;
        }

        for(const todo of todos) {
            console.log(todo[property]);
            if(String(todo[property]) == desiredValue) {
                filteredArray.push(todo);
            }
        }
        return filteredArray;
    }
}