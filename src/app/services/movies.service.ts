import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Genre,
    Genres,
    PeliculaDetalle, PersonDetail,
    RespuestaCombinedCredits,
    RespuestaCredits,
    RespuestaMDB,
    SearchResult
} from '../interfaces/interfaces';
import {ConfigService} from "./config.service";

var urlBackend = '';
var apiKey = '';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private popularesPage = 0;
  generos: Genre[] = [];
  private userLanguageCode: string = 'en'; // Valor por defecto

  constructor( private http: HttpClient, config: ConfigService) {
      urlBackend = config.config.apiBackendUrl + "/tmdb/tv";
      apiKey = config.config.apiKey;
  }

    /**
     * Establece el código de idioma del usuario para las peticiones.
     * Este método debe ser llamado cuando se carga el usuario.
     */
    setLanguage(code: string) {
        this.userLanguageCode = code;
    }

    private ejecutarBackend<T>(query: string) {
        query = urlBackend + query;
        // Usar el idioma almacenado
        query += `&language=${this.userLanguageCode}`;
        console.log("query", query);
        return this.http.get<T>(query);
    }

    getPopulares() {
        this.popularesPage++;

        const query = `/populares?popularesPage=${ this.popularesPage }`;
        return this.ejecutarBackend<RespuestaMDB>(query);
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

    return this.ejecutarBackend<RespuestaMDB>(`/feature?inicioStr=${ inicio }&finStr=${ fin }`);
  }

    getFeatureByGenre(genre: number) {
        return this.ejecutarBackend<RespuestaMDB>(`/feature?withGenre=${ genre }`);
    }

  getPeliculaDetalle(id: number){
    return this.ejecutarBackend<PeliculaDetalle>(`/${ id }?a=1`);
  }

  getActoresPelicula(id: number) {
    return this.ejecutarBackend<RespuestaCredits>(`/actoresSerie/${ id }?a=1`);
  }

  getSeriesActor(id: number) {
    return this.ejecutarBackend<RespuestaCombinedCredits>(`/person/${ id }/combinedCredits?a=1`);
  }

  getPersonDetail(id: number) {
    return this.ejecutarBackend<PersonDetail>(`/person/${ id }?a=1`);
  }

  buscarPeliculas(query: string) {
    return this.ejecutarBackend<SearchResult>(`/buscarSeries?query=${ query }`);
  }

  cargarGeneros(): Promise<Genre[]> {

    return new Promise( resolve => {
      return this.ejecutarBackend<Genres>('/generos?a=1')
      .subscribe( resp => {
        this.generos = resp.genres;
        console.log("generos", this.generos);
      resolve(this.generos);
      } );
    });

  }

}
