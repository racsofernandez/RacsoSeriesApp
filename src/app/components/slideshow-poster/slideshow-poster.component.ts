import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Pelicula } from 'src/app/interfaces/interfaces';
import { DetalleComponent } from '../detalle/detalle.component';

@Component({
  selector: 'app-slideshow-poster',
  templateUrl: './slideshow-poster.component.html',
  styleUrls: ['./slideshow-poster.component.scss'],
})
export class SlideshowPosterComponent  implements OnInit, OnChanges {

  @Input() peliculas: Pelicula[] = [];
  @ViewChild('swiper') swiperRef: ElementRef | undefined;

  constructor(private modalCtrl : ModalController) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
      if (changes['peliculas'] && this.swiperRef && this.swiperRef.nativeElement) {
          // Forzar actualización del swiper cuando cambian los datos
          setTimeout(() => {
              const swiperEl = this.swiperRef?.nativeElement as any;
              if (swiperEl && swiperEl.swiper) {
                  swiperEl.swiper.update();
              }
          }, 100);
      }
  }

  
  async verDetalle(id: number) {
    const modal = await this.modalCtrl.create( {
      component: DetalleComponent,
      componentProps: {
        id
      }
    })

    modal.present();
  }
}
