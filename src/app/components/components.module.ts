import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SlideshowBackdropComponent } from './slideshow-backdrop/slideshow-backdrop.component';
import { PipesModule } from '../pipes/pipes.module';
import { SlideshowPosterComponent } from './slideshow-poster/slideshow-poster.component';
import { SlideshowParesComponent } from './slideshow-pares/slideshow-pares.component';
import { DetalleComponent } from './detalle/detalle.component';
import { SlideshowPosterFavComponent } from './slideshow-poster-fav/slideshow-poster-fav.component';
import {ActorModalComponent} from "./actor-modal/actor-modal.component";
import {ActorFilmografiaComponent} from "./actor-filmografia/actor-filmografia.component";




@NgModule({
  declarations: [
    SlideshowBackdropComponent,
    SlideshowPosterComponent,
    SlideshowParesComponent,
    SlideshowPosterFavComponent,
    DetalleComponent,
    ActorModalComponent,
    ActorFilmografiaComponent
  ],
  exports: [
    SlideshowBackdropComponent,
    SlideshowPosterComponent,
    SlideshowParesComponent,
    SlideshowPosterFavComponent,
    DetalleComponent,
    ActorModalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
