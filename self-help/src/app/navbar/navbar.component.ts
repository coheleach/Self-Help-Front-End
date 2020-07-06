import { Component, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { InMemoryTodoRecallService } from '../helperServices/in-memory-todo-recall.service';
import { TodoService } from '../services/todo.service';

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
    private todoService: TodoService) { }

  ngOnInit(): void {
    this.authService.user.subscribe((user: User) => {
      this.loggedIn = (user ? true : false);
    });
  }

  onSignOut(): void {
    this.authService.signOut();
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
