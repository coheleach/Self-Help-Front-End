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
import { TodoCreateGuard } from './guards/todo-create.guard';
import { CardBodyToggleDirective } from './custom-directives/card-body-toggle.directive';
import { TodoStatusPipe } from './custom-pipes/todo-status.pipe';
import { TodoCompletionStatusComponent } from './to-dos/todo-completion-status/todo-completion-status.component';
import { ActiveOnClickDirective } from './custom-directives/active-on-click.directive';
import { TodoCategoryPipe } from './custom-pipes/todo-category.pipe';
import { TodoCreateComponent } from './to-dos/todo-create/todo-create.component';
import { CardTitleToggleDirective } from './custom-directives/card-title-toggle.directive';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthComponent } from './auth/auth.component'
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todos' },
  { path: 'todos', component: ToDosComponent, canActivate: [AuthGuard] },
  { path: 'todos-create', component: TodoCreateComponent, canActivate: [AuthGuard], canDeactivate: [TodoCreateGuard]},
  { path: 'todos-create/:index', component: TodoCreateComponent, canActivate: [AuthGuard, TodoCreateGuard]},
  { path: 'authorization', component: AuthComponent }
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
    CardTitleToggleDirective,
    TodoCategoryPipe,
    TodoCreateComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    HttpClientModule
  ],
  providers: [TodoCreateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
