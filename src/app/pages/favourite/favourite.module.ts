import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavouritePage } from './favourite.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './favourite-routing.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule,
    ComponentsModule
  ],
  declarations: [FavouritePage]
})
export class FavouritePageModule {}
