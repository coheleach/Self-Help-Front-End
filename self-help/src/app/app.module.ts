import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToDosComponent } from './to-dos/to-dos.component';
import { TodoTypesComponent } from './to-dos/todo-types/todo-types.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ToDosComponent,
    TodoTypesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
