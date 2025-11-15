import { Pipe, PipeTransform } from '@angular/core';
import {ConfigService} from "../services/config.service";


var URL = '';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

    constructor(private config: ConfigService) {
        URL = config.config.imgPath;
    }

    transform(img: string, size: string = "w500"): string {
    if ( !img ) {
      return './assets/no-image-banner.jpg';
    }
    const imgUrl = `${ URL }/${ size }${ img }`;
    return imgUrl;
  }

}
