import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeriesGenrePageRoutingModule } from './series-genre-routing.module';

import { SeriesGenrePage } from './series-genre.page';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SeriesGenrePageRoutingModule,
        PipesModule
    ],
  declarations: [SeriesGenrePage]
})
export class SeriesGenrePageModule {}
