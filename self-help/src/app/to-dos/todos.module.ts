import { NgModule } from "@angular/core";
import { ToDosComponent } from './to-dos.component';
import { TodoTypesComponent } from './todo-types/todo-types.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoDetailComponent } from './todo-list/todo-detail/todo-detail.component';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoStatusPipe } from '../custom-pipes/todo-status.pipe';
import { TodoCompletionStatusComponent } from './todo-completion-status/todo-completion-status.component';
import { CardBodyToggleDirective } from '../custom-directives/card-body-toggle.directive';
import { ActiveOnClickDirective } from '../custom-directives/active-on-click.directive';
import { CardTitleToggleDirective } from '../custom-directives/card-title-toggle.directive';
import { TodoCategoryPipe } from '../custom-pipes/todo-category.pipe';
import { TodosRoutingModule } from './todos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        ToDosComponent,
        TodoTypesComponent,
        TodoListComponent,
        TodoDetailComponent,
        TodoStatusPipe,
        TodoCompletionStatusComponent,
        CardBodyToggleDirective,
        ActiveOnClickDirective,
        CardTitleToggleDirective,
        TodoCategoryPipe,
        TodoCreateComponent
    ],
    imports: [
        TodosRoutingModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class TodosModule {}