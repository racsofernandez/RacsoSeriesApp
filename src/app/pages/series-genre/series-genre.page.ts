import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import {Pelicula, RespuestaMDB} from "../../interfaces/interfaces";

@Component({
    selector: 'app-series-genre',
    templateUrl: './series-genre.page.html',
    styleUrls: ['./series-genre.page.scss'],
})
export class SeriesGenrePage implements OnInit {

    peliculas: Pelicula[];
    generoId!: number;
    generoNombre = '';
    cargando = true;

    constructor(
        private route: ActivatedRoute,
        private moviesService: MoviesService
    ) {}

    async ngOnInit() {
        this.generoId = Number(this.route.snapshot.paramMap.get('id'));
        this.generoNombre = this.route.snapshot.paramMap.get('name') || '';

        await this.cargarPeliculas();
    }

    cargarPeliculas() {
        this.cargando = true;

        // this.moviesService.cargarPeliculasPorGenero(this.generoId).subscribe({
        this.moviesService.getFeatureByGenre(this.generoId).subscribe({
            next: (resp) => {
                this.peliculas = resp.results;
                this.cargando = false;
            },
            error: (error) => {
                console.error('Error cargando películas', error);
                this.cargando = false;
            }
        });
    }

}

