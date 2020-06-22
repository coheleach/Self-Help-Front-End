import { Component, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  subscription: Subscription;
  loggedIn: boolean;

  constructor() { }

  ngOnInit(): void {
    
  }

}
