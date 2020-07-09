import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SingleButtonTestComponent } from './testing-directory/single-button-test/single-button-test.component';

const routes: Routes = [
    
    { path: 'authorization', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
    { path: '', pathMatch: 'full', redirectTo: 'authorization' },
    { path: 'testing', component: SingleButtonTestComponent},
    { path: 'todos', loadChildren: () => import('./to-dos/todos.module').then(m => m.TodosModule)}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}