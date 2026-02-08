import { Component, OnInit } from '@angular/core';
import { Genre, PeliculaDetalle } from '../../interfaces/interfaces';
import { MoviesService } from '../../services/movies.service';
import {SeriesDbService} from "../../services/series-db.service";
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'app-favourite',
  templateUrl: 'favourite.page.html',
  styleUrls: ['favourite.page.scss']
})
export class FavouritePage {

  series: PeliculaDetalle[] = [];
  generos: Genre[] = [];
  favoritoGenero: any[] = [];
  loaded = false; // 👈 Nueva variable

  constructor(private dataLocal: SeriesDbService, private movieService: MoviesService, private auth: Auth) {}

  async ionViewWillEnter() {
    this.loaded = false; // Resetear al entrar
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
          this.loaded = true; // 👈 Listo
      }
    }
    else {
      console.error('No hay uid, error');
      this.loaded = true;
    }
  }

  pelisPorGenero( generos: Genre[], series: PeliculaDetalle[] ) {

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
