import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {ConfigService} from "./app/services/config.service";

if (environment.production) {
    enableProdMode();
}

const configService = new ConfigService();

fetch('/assets/config.json')
    .then(res => res.json())
    .then(config => {
        console.log('✅ Runtime config:', config);

        // Guarda el config globalmente para que Angular lo use luego
        (window as any).config = config; // 👈 guardamos en window para que AppModule lo use

        // Ahora arranca Angular
        return platformBrowserDynamic()
            .bootstrapModule(AppModule)
            .catch(err => console.error(err));
    })
    .catch(err => {
        console.error('❌ Error cargando config.json', err);
    });
