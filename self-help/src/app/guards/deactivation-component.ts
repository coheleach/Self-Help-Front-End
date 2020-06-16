import { Observable } from 'rxjs';

export interface DeactivationComponent {
    CanDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}