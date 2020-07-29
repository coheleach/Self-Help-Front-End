import { Component, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { InMemoryTodoRecallService } from '../helperServices/in-memory-todo-recall.service';
import { TodoService } from '../services/todo.service';
import { Store } from '@ngrx/store';
import * as fromAuthReducer from '../auth/store/auth.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';
import * as fromAppReducer from '../store/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private inMemoryTodoRecallService: InMemoryTodoRecallService,
    private todoService: TodoService,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe((user: User) => {
      this.loggedIn = (user ? true : false);
    });
  }

  onSignOut(): void {
    this.store.dispatch(new fromAuthActions.AuthLogout());
  }

  isUserEditingTodos(): boolean {
    if(this.inMemoryTodoRecallService.fetchTodosFromLocalStorage()) {
      return true;
    }
    return false;
  }

  onUndoChanges() {
    this.todoService.revertToLastSavedTodos();
  }

  onSaveChanges() {
    this.todoService.saveTodoListChanges();
  }

}
