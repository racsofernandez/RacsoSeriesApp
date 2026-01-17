import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPage } from './search.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { SearchPageRoutingModule } from './search-routing.module';
import { PipesModule } from "../../pipes/pipes.module";
import {GenreListModule} from "../../components/genre-list/genre-list.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [SearchPage],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        SearchPageRoutingModule,
        PipesModule,
        GenreListModule,
        TranslateModule
    ]
})
export class SearchPageModule {}
