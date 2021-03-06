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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { TodoListResolver } from './resolvers/todo-list-resolver.service';
import { FirebaseInterceptorService } from './interceptors/firebase-interceptor.service';
import { SingleButtonTestComponent } from './testing-directory/single-button-test/single-button-test.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'authorization' },
  { path: 'todos', component: ToDosComponent, canActivate: [AuthGuard], resolve: [TodoListResolver] },
  { path: 'todos-create', component: TodoCreateComponent, canActivate: [AuthGuard], canDeactivate: [TodoCreateGuard]},
  { path: 'todos-create/:id', component: TodoCreateComponent, canActivate: [AuthGuard, TodoCreateGuard], resolve: [TodoListResolver]},
  { path: 'authorization', component: AuthComponent },
  { path: 'testing', component: SingleButtonTestComponent}
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
    AuthComponent,
    SingleButtonTestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    HttpClientModule
  ],
  providers: [
    TodoCreateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FirebaseInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
