import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {Image, Persona, PersonDetail} from '../../interfaces/interfaces';
import {MoviesService} from "../../services/movies.service";
import {ImageViewerModalComponent} from "../image-viewer-modal/image-viewer-modal.component";

@Component({
    selector: 'app-actor-modal',
    templateUrl: './actor-modal.component.html',
    styleUrls: ['./actor-modal.component.scss']
})
export class ActorModalComponent implements OnInit {

    @Input() persona!: Persona;
    personDetail: PersonDetail;
    bioExpanded = false;
    loaded = false; // 👈 Nueva variable

    constructor(private moviesService: MoviesService, private modalCtrl: ModalController) {}

    ngOnInit(): void {
        this.moviesService.getPersonDetail(this.persona.id)
            .subscribe({
                next: (resp) => {
                    this.personDetail = resp;
                    this.loaded = true; // 👈 Listo
                },
                error: (err) => {
                    console.error(err);
                    this.loaded = true;
                }
            });
    }

    cerrar() {
        this.modalCtrl.dismiss();
    }

    async verImagen() {
        if (!this.persona.profile_path) return;

        const image: Image = {
            file_path: this.persona.profile_path,
            aspect_ratio: 0,
            height: 0,
            iso_639_1: null,
            vote_average: 0,
            vote_count: 0,
            width: 0
        };

        const modal = await this.modalCtrl.create({
            component: ImageViewerModalComponent,
            componentProps: {
                images: [image],
                startIndex: 0,
                title: this.persona.name
            }
        });
        await modal.present();
    }
}
