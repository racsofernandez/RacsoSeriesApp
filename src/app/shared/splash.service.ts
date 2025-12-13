import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SplashService {

    private visibleSubject = new BehaviorSubject<boolean>(false);
    visible$ = this.visibleSubject.asObservable();

    private startTime = Date.now();
    private minDuration = 600; // ms

    hide() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(this.minDuration - elapsed, 0);

        setTimeout(() => {
            this.visibleSubject.next(false);
        }, remaining);
    }

    show() {
        this.startTime = Date.now();
        this.visibleSubject.next(true);
    }
}
