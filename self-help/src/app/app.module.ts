import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToDosComponent } from './to-dos/to-dos.component';
import { TodoTypesComponent } from './to-dos/todo-types/todo-types.component';
import { TodoListComponent } from './to-dos/todo-list/todo-list.component';
import { TodoDetailComponent } from './to-dos/todo-list/todo-detail/todo-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ToDosComponent,
    TodoTypesComponent,
    TodoListComponent,
    TodoDetailComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
