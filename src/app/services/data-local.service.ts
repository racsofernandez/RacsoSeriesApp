import { Injectable } from '@angular/core';
import { SeriesDetail } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  
  peliculas: SeriesDetail[] = [];

  constructor( private storage: Storage,
               private toastCtrl: ToastController) {

    this.cargarFavoritos();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

  guardarPelicula( pelicula: SeriesDetail) {

    let existe = false;
    let mensaje = '';

    for ( const peli of this.peliculas) {
      if (peli.id === pelicula.id) {
        existe = true;
        break;
      }
    }

    if ( existe ) {
      this.peliculas = this.peliculas.filter( peli => peli.id!== pelicula.id)
      mensaje = 'Removido de favoritos';
    }
    else {
      this.peliculas.push( pelicula );
      mensaje = 'Agregada a favoritos';
    }

    this.presentToast( mensaje );
    this.storage.set('peliculas', this.peliculas);

    return !existe;
  }

  async cargarFavoritos() {
    const peliculas = await this.storage.get('peliculas'); 
    this.peliculas = peliculas || [];
    console.log("Peliculas", this.peliculas);
    return this.peliculas;
  }

  async existePelicula(id: number)  {

    await this.cargarFavoritos();
    const existe = this.peliculas.find( peli => peli.id === id );

    return (existe) ? true : false;

  }

}
