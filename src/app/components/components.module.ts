import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importante para ngModel
import { SlideshowBackdropComponent } from './slideshow-backdrop/slideshow-backdrop.component';
import { PipesModule } from '../pipes/pipes.module';
import { SlideshowPosterComponent } from './slideshow-poster/slideshow-poster.component';
import { SlideshowParesComponent } from './slideshow-pares/slideshow-pares.component';
import { DetalleComponent } from './detalle/detalle.component';
import { SlideshowPosterFavComponent } from './slideshow-poster-fav/slideshow-poster-fav.component';
import {ActorModalComponent} from "./actor-modal/actor-modal.component";
import {ActorFilmografiaComponent} from "./actor-filmografia/actor-filmografia.component";
import { SeasonsModalComponent } from './seasons-modal/seasons-modal.component';
import {TranslateModule} from "@ngx-translate/core";
import { ImageViewerModalComponent } from './image-viewer-modal/image-viewer-modal.component';
import { UserListModalComponent } from './user-list-modal/user-list-modal.component';
import { ListsPopoverComponent } from './lists-popover/lists-popover.component';
import { RecommendationsModalComponent } from './recommendations-modal/recommendations-modal.component';




@NgModule({
  declarations: [
    SlideshowBackdropComponent,
    SlideshowPosterComponent,
    SlideshowParesComponent,
    SlideshowPosterFavComponent,
    DetalleComponent,
    ActorModalComponent,
    ActorFilmografiaComponent,
    SeasonsModalComponent,
    ImageViewerModalComponent,
    UserListModalComponent,
    ListsPopoverComponent,
    RecommendationsModalComponent
  ],
  exports: [
    SlideshowBackdropComponent,
    SlideshowPosterComponent,
    SlideshowParesComponent,
    SlideshowPosterFavComponent,
    ActorModalComponent,
    SeasonsModalComponent,
    ImageViewerModalComponent,
    UserListModalComponent,
    ListsPopoverComponent,
    RecommendationsModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
