import { Component, Input, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Image } from 'src/app/interfaces/interfaces';
import { Share } from '@capacitor/share';
import { ConfigService } from '../../services/config.service';
import { TranslateService } from '@ngx-translate/core';

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
  
  controlsVisible = true;
  currentIndex = 0;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private configService: ConfigService,
    private ngZone: NgZone,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.currentIndex = this.startIndex;
  }

  ngAfterViewInit() {
    if (this.swiperRef?.nativeElement) {
      const swiperEl = this.swiperRef.nativeElement;
      
      // Esperar a que el componente se inicialice completamente
      setTimeout(() => {
        if (swiperEl.swiper) {
          swiperEl.swiper.slideTo(this.startIndex, 0);
          
          swiperEl.swiper.on('slideChange', () => {
            this.ngZone.run(() => {
              this.currentIndex = swiperEl.swiper.activeIndex;
            });
          });
        }
      }, 100);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  toggleControls() {
    this.controlsVisible = !this.controlsVisible;
  }

  async shareImage() {
    const currentImage = this.images[this.currentIndex];
    if (!currentImage) return;

    const imageUrl = `${this.configService.config.imgPath}${currentImage.file_path}`;

    try {
      const shareTitle = await this.translate.get('IMAGE_VIEWER.SHARE_TITLE').toPromise();
      const shareText = await this.translate.get('IMAGE_VIEWER.SHARE_TEXT').toPromise();
      const shareDialogTitle = await this.translate.get('IMAGE_VIEWER.SHARE_DIALOG_TITLE').toPromise();

      await Share.share({
        title: this.title || shareTitle,
        text: shareText,
        url: imageUrl,
        dialogTitle: shareDialogTitle
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  get shareIcon(): string {
    return this.platform.is('ios') ? 'share-outline' : 'share-social-outline';
  }

}
