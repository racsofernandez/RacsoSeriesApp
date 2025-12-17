import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeriesGenrePage } from './series-genre.page';

const routes: Routes = [
  {
    path: '',
    component: SeriesGenrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeriesGenrePageRoutingModule {}
