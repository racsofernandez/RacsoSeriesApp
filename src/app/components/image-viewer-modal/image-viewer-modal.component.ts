import { Component, Input, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Image } from 'src/app/interfaces/interfaces';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
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

      // Descargar la imagen y convertirla a base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64Data = await this.convertBlobToBase64(blob) as string;

      // Guardar temporalmente en el sistema de archivos
      const fileName = `shared_image_${new Date().getTime()}.jpg`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache
      });

      // Compartir el archivo local
      await Share.share({
        title: this.title || shareTitle,
        text: shareText,
        url: savedFile.uri,
        dialogTitle: shareDialogTitle
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  get shareIcon(): string {
    return this.platform.is('ios') ? 'share-outline' : 'share-social-outline';
  }

}
