import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MoviesService } from '../../services/movies.service';
import { Genre } from '../../interfaces/interfaces';

@Component({
    selector: 'app-genre-list',
    templateUrl: './genre-list.component.html',
    styleUrls: ['./genre-list.component.scss'],
})
export class GenreListComponent implements OnInit {

    generos: Genre[] = [];
    cargando = true;

    constructor(
        private modalCtrl: ModalController,
        private moviesService: MoviesService
    ) {}

    async ngOnInit() {
        await this.cargarGeneros();
    }

    async cargarGeneros() {
        try {
            this.generos = await this.moviesService.cargarGeneros();
        } catch (error) {
            console.error('Error cargando géneros', error);
        } finally {
            this.cargando = false;
        }
    }

    seleccionarGenero(genero: Genre) {
        this.modalCtrl.dismiss({ genero });
    }

    cerrar() {
        this.modalCtrl.dismiss();
    }
}
