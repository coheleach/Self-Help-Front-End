import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';

@Injectable()
export class TodosEffects {

    constructor(
        private actions$: Actions
    ) {}
}