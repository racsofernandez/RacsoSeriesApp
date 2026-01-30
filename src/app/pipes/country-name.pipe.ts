import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'countryName',
  pure: false // Para que se actualice si cambia el idioma
})
export class CountryNamePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(countryName: string | undefined, isoCode: string | undefined): string {
    if (!countryName) return '';
    
    // Si tenemos el código ISO, podemos intentar usar Intl.DisplayNames
    if (isoCode) {
      try {
        const currentLang = this.translate.currentLang || 'es';
        const regionNames = new Intl.DisplayNames([currentLang], { type: 'region' });
        return regionNames.of(isoCode) || countryName;
      } catch (e) {
        console.warn('Error translating country:', e);
        return countryName;
      }
    }

    return countryName;
  }

}
