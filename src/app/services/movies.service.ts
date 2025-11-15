import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre, Genres, PeliculaDetalle, RespuestaCredits, RespuestaMDB, SearchResult } from '../interfaces/interfaces';
import {ConfigService} from "./config.service";

var URL = '';
var apiKey = '';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private popularesPage = 0;
  generos: Genre[] = [];

  constructor( private http: HttpClient, config: ConfigService) {
      URL = config.config.url;
      apiKey = config.config.apiKey;
  }

  private ejecutarQuery<T>(query: string) {
    query = URL + query;
    query += `&language=es-ES&api_key=${ apiKey }`;
    console.log("query", query);
    return this.http.get<T>(query);
  }

  getPopulares() {
    this.popularesPage++;

    const query = `/discover/tv?sort_by=popularity.desc&page=${ this.popularesPage }`;
    return this.ejecutarQuery<RespuestaMDB>(query);
  }

  getFeature() {
    const hoy = new Date();
    const ultimoDia = new Date( hoy.getFullYear(), hoy.getMonth() + 1, 0 ).getDate();
    const mes = hoy.getMonth() + 1;
    let mesString;

    if ( mes < 10 ) {
      mesString = '0' + mes;
    }
    else {
      mesString = mes;
    }

    const inicio = `${ hoy.getFullYear() }-${ mesString }-01`;
    const fin = `${ hoy.getFullYear() }-${ mesString }-${ ultimoDia }`;

    return this.ejecutarQuery<RespuestaMDB>(`/discover/tv?primary_release_date.gte=${ inicio }&primary_release_date.lte=${ fin }`);
  }

  getPeliculaDetalle(id: number){

    return this.ejecutarQuery<PeliculaDetalle>(`/tv/${ id }?a=1`);

  }

  getActoresPelicula(id: number) {

    return this.ejecutarQuery<RespuestaCredits>(`/tv/${ id }/credits?a=1`);

  }

  buscarPeliculas(query: string) {
    return this.ejecutarQuery<SearchResult>(`/search/tv?query=${ query }`);
  }

  cargarGeneros(): Promise<Genre[]> {

    return new Promise( resolve => {
      return this.ejecutarQuery<Genres>('/genre/tv/list?a=1')
      .subscribe( resp => {
        this.generos = resp.genres;
        console.log("generos", this.generos);
      resolve(this.generos);
      } );
    });

  }


}
