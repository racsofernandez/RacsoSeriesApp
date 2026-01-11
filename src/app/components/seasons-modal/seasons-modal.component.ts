import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Season } from 'src/app/interfaces/interfaces';

interface SeasonWithState extends Season {
  expanded?: boolean;
}

@Component({
  selector: 'app-seasons-modal',
  templateUrl: './seasons-modal.component.html',
  styleUrls: ['./seasons-modal.component.scss'],
})
export class SeasonsModalComponent implements OnInit {

  @Input() seasons: Season[] = [];
  @Input() seriesTitle: string = '';
  
  seasonsList: SeasonWithState[] = [];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    // Copiamos las temporadas y añadimos el estado expanded
    this.seasonsList = this.seasons.map(s => ({ ...s, expanded: false }));
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
  
  toggleOverview(season: SeasonWithState) {
    season.expanded = !season.expanded;
  }

}
