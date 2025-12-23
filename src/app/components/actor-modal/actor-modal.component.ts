import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {Persona, PersonDetail} from '../../interfaces/interfaces';
import {MoviesService} from "../../services/movies.service";

@Component({
    selector: 'app-actor-modal',
    templateUrl: './actor-modal.component.html',
    styleUrls: ['./actor-modal.component.scss']
})
export class ActorModalComponent implements OnInit {

    @Input() persona!: Persona;
    personDetail: PersonDetail;
    bioExpanded = false;

    constructor(private moviesService: MoviesService, private modalCtrl: ModalController) {}

    ngOnInit(): void {
        this.moviesService.getPersonDetail(this.persona.id)
            .subscribe( resp => {
                this.personDetail = resp;
            })
    }

    cerrar() {
        this.modalCtrl.dismiss();
    }
}

