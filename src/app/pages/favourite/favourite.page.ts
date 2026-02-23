import { Component, OnInit } from '@angular/core';
import { Genre, SeriesDetail } from '../../interfaces/interfaces';
import { MoviesService } from '../../services/movies.service';
import {SeriesDbService} from "../../services/series-db.service";
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'app-favourite',
  templateUrl: 'favourite.page.html',
  styleUrls: ['favourite.page.scss']
})
export class FavouritePage {

  series: SeriesDetail[] = [];
  generos: Genre[] = [];
  favoritoGenero: any[] = [];
  loaded = false;
  firstLoad = true;

  constructor(private dataLocal: SeriesDbService, private movieService: MoviesService, private auth: Auth) {}

  async ionViewWillEnter() {
    await this.cargarFavoritos();
  }

  async cargarFavoritos(event?: any) {
    // Solo mostramos el skeleton si es la primera vez o si no hay datos cargados
    if (this.firstLoad && !event) {
        this.loaded = false;
    }
    
    const uid = this.auth.currentUser?.uid;
    if (uid!=null) {
      try {
          this.series = await this.dataLocal.cargarSeriesFavoritas(uid);
          console.log('Series favoritas', this.series);
          this.generos = await this.movieService.cargarGeneros();
          this.pelisPorGenero(this.generos, this.series);
      } catch (e) {
          console.error(e);
      } finally {
          this.loaded = true;
          this.firstLoad = false;
          if (event) event.target.complete();
      }
    }
    else {
      console.error('No hay uid, error');
      this.loaded = true;
      this.firstLoad = false;
      if (event) event.target.complete();
    }
  }

  doRefresh(event: any) {
      this.cargarFavoritos(event);
  }

  pelisPorGenero( generos: Genre[], series: SeriesDetail[] ) {

    this.favoritoGenero = [];

    generos.forEach( genero => {
      this.favoritoGenero.push({
        name: genero.name,
        pelis: series.filter( peli => {
          return peli.genres?.find(genre => genre.id === genero.id);
        } )
      });
    });


    console.log("favorito", this.favoritoGenero);

  }

  async onModalDismiss(data: any) {
        console.log("Recibido en favourite.component.ts:", data);

        // por ejemplo, recargar favoritos si el modal ha eliminado uno:
        if (data?.updated) {
            this.ionViewWillEnter();
        }
    }

}
