import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.scss'],
    animations: [
        trigger('fadeScale', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(1.05)' }),
                animate('300ms ease-out',
                    style({ opacity: 1, transform: 'scale(1)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in',
                    style({ opacity: 0, transform: 'scale(0.98)' }))
            ])
        ])
    ],
    host: { '[@fadeScale]': '' }
})
export class SplashComponent {}
