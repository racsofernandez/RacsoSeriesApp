import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RecommendationsService } from '../../services/recommendations.service';
import { Auth } from '@angular/fire/auth';
import { RecommendationResponse } from '../../interfaces/interfaces';
import { DetalleComponent } from '../detalle/detalle.component';

@Component({
  selector: 'app-recommendations-modal',
  templateUrl: './recommendations-modal.component.html',
  styleUrls: ['./recommendations-modal.component.scss'],
})
export class RecommendationsModalComponent implements OnInit {

  recommendations: RecommendationResponse | null = null;
  loading = true;
  error = false;

  constructor(
    private modalCtrl: ModalController,
    private recommendationsService: RecommendationsService,
    private auth: Auth
  ) { }

  async ngOnInit() {
    await this.loadRecommendations();
  }

  async loadRecommendations() {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
        this.loading = false;
        this.error = true;
        return;
    }

    this.loading = true;
    this.error = false;
    try {
      this.recommendations = await this.recommendationsService.getRecommendations(userId);
    } catch (e) {
      console.error(e);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async verDetalle(id: number) {
    const modal = await this.modalCtrl.create({
      component: DetalleComponent,
      componentProps: { id }
    });
    await modal.present();
  }
}
