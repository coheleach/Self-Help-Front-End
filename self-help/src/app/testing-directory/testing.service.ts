import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap, exhaustMap, map } from 'rxjs/operators';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { Todo } from '../models/Todo.model';

@Injectable({providedIn: 'root'})
export class TestingService {

    constructor(private authService: AuthService, private firebaseStorageService: FirebaseStorageService, private httpClient: HttpClient) { }

    executeTest() {
        this.firebaseStorageService.getUserNodeKey().subscribe(key => {
            console.log(key);
        })
    }
}