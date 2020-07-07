import { Todo } from '../models/Todo.model';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/User.model';
import { error } from 'protractor';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class TodoFactoryService {
    
    private userNodeKey: string;
    private idIncrement: number;
    
    constructor() { 
        this.idIncrement = 0;
        this.userNodeKey = null;
    }

    setUserNodeKey(nodeKey: string) {
        this.userNodeKey = nodeKey;
    }

    generateIdGivenNodeKey(nodeKey: string): string {
        return nodeKey + '_' + (++this.idIncrement);
     }

    generateTodoWithoutId(
        title: string,
        description: string,
        category: string,
        deadlineDate: Date,
        creationDate?: Date,
        completed?: boolean
    ): Todo {
        return new Todo(
            this.generateIdGivenNodeKey(this.userNodeKey),
            title,
            description,
            category,
            deadlineDate,
            creationDate,
            completed
        );
    }
}