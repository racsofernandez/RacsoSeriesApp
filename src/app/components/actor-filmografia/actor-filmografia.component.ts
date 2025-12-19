import {Component, Input, numberAttribute, OnInit} from '@angular/core';
import {MoviesService} from "../../services/movies.service";
import {FilmografiaItem} from "../../interfaces/interfaces";
import {IonCard, IonLabel} from "@ionic/angular/standalone";
import {PipesModule} from "../../pipes/pipes.module";
import {ModalController, NavController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {DetalleComponent} from "../detalle/detalle.component";

@Component({
    selector: 'app-actor-filmografia',
    templateUrl: './actor-filmografia.component.html',
    styleUrls: ['./actor-filmografia.component.scss'],
})
export class ActorFilmografiaComponent  implements OnInit {

    @Input() personId!: number;
    filmografia: FilmografiaItem[] = [];

    constructor(private moviesService: MoviesService,
                private modalCtrl: ModalController,
                private navCtrl: NavController) {}

    ngOnInit() {
        console.log('Actor filmografía personId:', this.personId);
        this.moviesService
            .getSeriesActor(this.personId)
            .subscribe(resp => {
                this.filmografia = resp.cast
                    .sort((a, b) =>
                        (b.release_date || b.first_air_date || '')
                            .localeCompare(a.release_date || a.first_air_date || '')
                    );
            });

    }

    async abrirSerie(serie: FilmografiaItem) {
        await this.modalCtrl.dismiss(); // 🔑 cerrar modal actor
        this.navCtrl.navigateForward(`/serie/${serie.id}`);
    }

    async verDetalle(id: number) {
        await this.modalCtrl.dismiss(); // 🔑 cerrar modal actor
        const modal = await this.modalCtrl.create( {
            component: DetalleComponent,
            componentProps: {
                id
            }
        })

        modal.present();
    }


}
