import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { Drivers, Storage } from '@ionic/storage';
import {HomePage} from "./pages/home/home.page";
import { initializeApp } from "firebase/app";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // 👇 Inicializa Firebase y Auth correctamente
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
],
  bootstrap: [AppComponent]
})
export class AppModule {}
