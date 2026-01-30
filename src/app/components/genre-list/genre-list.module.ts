import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GenreListComponent } from './genre-list.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [GenreListComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule
    ],
    exports: [GenreListComponent]
})
export class GenreListModule {}
