import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToDosComponent } from './to-dos.component';
import { AuthGuard } from '../guards/auth.guard';
import { TodoListResolver } from '../resolvers/todo-list-resolver.service';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoCreateGuard } from '../guards/todo-create.guard';

const routes: Routes = [
    { path: '', component: ToDosComponent, canActivate: [AuthGuard], resolve: [TodoListResolver] },
    { path: 'create', component: TodoCreateComponent, canActivate: [AuthGuard], canDeactivate: [TodoCreateGuard], children: [
       { path: ':id', component: TodoCreateComponent, canActivate: [TodoCreateGuard], resolve: [TodoListResolver] }
    ]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TodosRoutingModule {}