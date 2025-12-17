import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeriesGenrePageRoutingModule } from './series-genre-routing.module';

import { SeriesGenrePage } from './series-genre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeriesGenrePageRoutingModule
  ],
  declarations: [SeriesGenrePage]
})
export class SeriesGenrePageModule {}
