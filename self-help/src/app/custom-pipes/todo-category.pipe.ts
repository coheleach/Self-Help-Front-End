import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../models/Todo.model';

@Pipe({
  name: 'todoCategory',
  pure: false
})
export class TodoCategoryPipe implements PipeTransform {

  transform(todos: Todo[], categories: string[])  {
    let filteredArray: Todo[] = [];
    if(categories.length == 0) {
      return todos;
    }

    for(let todo of todos) {
      if(categories.includes(todo.category)) {
        filteredArray.push(todo);
      }
    }

    console.log(categories);

    return filteredArray;
  }

}
