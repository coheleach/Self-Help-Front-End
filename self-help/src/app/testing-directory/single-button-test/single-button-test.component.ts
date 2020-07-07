import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { Todo } from 'src/app/models/Todo.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { exhaustMap } from 'rxjs/operators';
import { TestingService } from '../testing.service';

@Component({
  selector: 'app-single-button-test',
  templateUrl: './single-button-test.component.html',
  styleUrls: ['./single-button-test.component.css']
})
export class SingleButtonTestComponent implements OnInit {

  constructor(
      private testingService: TestingService
    ) { }

  ngOnInit(): void {
  }

  onClick() {
    this.executeTest();
  }

  executeTest() {
    //Your test here
    this.testingService.executeTest();  
  
  }
}
