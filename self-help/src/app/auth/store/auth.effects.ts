import { Effect, ofType, Actions } from '@ngrx/effects'
import * as fromAuthActions from './auth.actions';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthEffects {
    
  @Effect({dispatch: false})
  authSignOut = this.actions$.pipe(
    ofType(fromAuthActions.AUTH_SIGN_OUT),
    tap(() => {
      this.router.navigate(['/authorization']);
    })
  )

  constructor(
    private actions$: Actions,  
    private router: Router
  ) {}
}