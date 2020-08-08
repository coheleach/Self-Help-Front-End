import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TodoCreateGuard } from './guards/todo-create.guard';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FirebaseInterceptorService } from './interceptors/firebase-interceptor.service';
import { SingleButtonTestComponent } from './testing-directory/single-button-test/single-button-test.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { User } from './models/User.model';
import * as fromAuthReducer from  './auth/store/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { appReducer } from './store/app.reducer';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { TodosEffects } from './to-dos/store/todos.effects';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SingleButtonTestComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    HttpClientModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects, TodosEffects]),
    //StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({logOnly: environment.production})
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
