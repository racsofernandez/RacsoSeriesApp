import { Component, OnInit } from '@angular/core';
import { Genre, PeliculaDetalle } from '../interfaces/interfaces';
import { MoviesService } from '../services/movies.service';
import {SeriesDbService} from "../services/series-db.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  peliculas: PeliculaDetalle[] = [];
  generos: Genre[] = [];
  favoritoGenero: any[] = [];


  constructor(private dataLocal: SeriesDbService, private movieService: MoviesService) {}

  async ionViewWillEnter() {
    this.peliculas = await this.dataLocal.cargarFavoritos();
    this.generos = await this.movieService.cargarGeneros();
    this.pelisPorGenero(this.generos, this.peliculas);
  }

  pelisPorGenero( generos: Genre[], peliculas: PeliculaDetalle[] ) {

    this.favoritoGenero = [];

    generos.forEach( genero => {
      this.favoritoGenero.push({
        name: genero.name,
        pelis: peliculas.filter( peli => {
          return peli.genres?.find(genre => genre.id === genero.id);
        } )
      });
    });


    console.log("favorito", this.favoritoGenero);


    // let favorito: Favorito = ;

    // for (var idPeli=0; idPeli<peliculas.length; idPeli++) {
    //   const k: any = peliculas[idPeli].genres ? peliculas[idPeli].genres?.length : 0;
    //   for (var idGenero=0; idGenero<k; idGenero++) {
    //     favoritoGenero.push({
    //       genero: peliculas[idPeli].genres?[idGenero].
    //     })
    //   }
    // }



  }
  
}
