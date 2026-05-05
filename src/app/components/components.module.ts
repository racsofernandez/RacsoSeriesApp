import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importante para ngModel
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
import { ReviewModalComponent } from './review-modal/review-modal.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { UserReviewsComponent } from './user-reviews/user-reviews.component';
import { SeriesReviewsComponent } from './series-reviews/series-reviews.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserListDetailComponent } from './user-list-detail/user-list-detail.component';

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
    RecommendationsModalComponent,
    ReviewModalComponent,
    RegisterUserComponent,
    UserReviewsComponent,
    SeriesReviewsComponent,
    EditProfileComponent,
    UserListDetailComponent
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
    RecommendationsModalComponent,
    UserReviewsComponent,
    SeriesReviewsComponent,
    EditProfileComponent,
    UserListDetailComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
