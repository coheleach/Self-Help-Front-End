import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: AuthComponent}])
    ],
    exports: [
        RouterModule
    ]
})
export class AuthModule {}