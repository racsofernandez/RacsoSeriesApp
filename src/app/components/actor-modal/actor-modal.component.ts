import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Persona } from '../../interfaces/interfaces';

@Component({
    selector: 'app-actor-modal',
    templateUrl: './actor-modal.component.html',
    styleUrls: ['./actor-modal.component.scss']
})
export class ActorModalComponent {

    @Input() persona!: Persona;

    constructor(private modalCtrl: ModalController) {}

    cerrar() {
        this.modalCtrl.dismiss();
    }
}

