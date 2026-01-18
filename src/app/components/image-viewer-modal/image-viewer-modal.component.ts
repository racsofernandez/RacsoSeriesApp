import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Image } from 'src/app/interfaces/interfaces';
import Swiper from 'swiper';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-image-viewer-modal',
  templateUrl: './image-viewer-modal.component.html',
  styleUrls: ['./image-viewer-modal.component.scss'],
})
export class ImageViewerModalComponent implements OnInit {

  @Input() images: Image[] = [];
  @Input() startIndex: number = 0;
  @Input() title: string = '';

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiperModules = [IonicSlides];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.swiperRef?.nativeElement) {
      const swiperEl = this.swiperRef.nativeElement;
      
      // Esperar a que el componente se inicialice completamente
      setTimeout(() => {
        if (swiperEl.swiper) {
          swiperEl.swiper.slideTo(this.startIndex, 0);
        }
      }, 100);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
