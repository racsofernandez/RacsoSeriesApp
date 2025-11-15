import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    public firebaseConfig: any;
    public config: any;

    async loadConfig() {
        const res = await fetch('/assets/config.json');
        this.config = await res.json();
        console.log('loading config...', this.config);
        this.firebaseConfig = this.config.firebaseConfig;
    }
}

