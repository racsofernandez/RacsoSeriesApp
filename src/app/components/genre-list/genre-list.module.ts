import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GenreListComponent } from './genre-list.component';

@NgModule({
    declarations: [GenreListComponent],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [GenreListComponent]
})
export class GenreListModule {}
