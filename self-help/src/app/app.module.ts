import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToDosComponent } from './to-dos/to-dos.component';
import { TodoTypesComponent } from './to-dos/todo-types/todo-types.component';
import { TodoListComponent } from './to-dos/todo-list/todo-list.component';
import { TodoDetailComponent } from './to-dos/todo-list/todo-detail/todo-detail.component';

import { CardBodyToggleDirective } from './custom-directives/card-body-toggle.directive';

import { TodoStatusPipe } from './custom-pipes/todo-status.pipe';
import { TodoCompletionStatusComponent } from './to-dos/todo-completion-status/todo-completion-status.component';
import { ActiveOnClickDirective } from './custom-directives/active-on-click.directive';
import { TodoCategoryPipe } from './custom-pipes/todo-category.pipe';
import { TodoCreateComponent } from './to-dos/todo-create/todo-create.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todos' },
  { path: 'todos', component: ToDosComponent },
  { path: 'todos-create', component: TodoCreateComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ToDosComponent,
    TodoTypesComponent,
    TodoListComponent,
    TodoDetailComponent,
    CardBodyToggleDirective,
    TodoStatusPipe,
    TodoCompletionStatusComponent,
    ActiveOnClickDirective,
    TodoCategoryPipe,
    TodoCreateComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
