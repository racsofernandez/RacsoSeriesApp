import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Pelicula, PeliculaDetalle } from 'src/app/interfaces/interfaces';
import { DetalleComponent } from '../detalle/detalle.component';

@Component({
  selector: 'app-slideshow-poster-fav',
  templateUrl: './slideshow-poster-fav.component.html',
  styleUrls: ['./slideshow-poster-fav.component.scss'],
})
export class SlideshowPosterFavComponent  implements OnInit {

  @Input() peliculas: PeliculaDetalle[] = [];
  @Output() dismissEvent = new EventEmitter<any>();

  constructor(private modalCtrl : ModalController) { }

  ngOnInit() {}

  
  async verDetalle(id: number) {
    const modal = await this.modalCtrl.create( {
      component: DetalleComponent,
      componentProps: {
        id
      }
    })

    await modal.present();
    const {data}  = await modal.onWillDismiss();
    // Emitimos al padre
    this.dismissEvent.emit(data);
    console.log("onWilDismiss", data);
  }
}
