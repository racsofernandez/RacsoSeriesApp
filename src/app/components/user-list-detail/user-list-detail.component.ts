import { Component, Input, OnInit, Type } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserList, SerieDetalle } from '../../interfaces/interfaces';
import { UserListService } from '../../services/user-list.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-list-detail',
  templateUrl: './user-list-detail.component.html',
  styleUrls: ['./user-list-detail.component.scss'],
})
export class UserListDetailComponent implements OnInit {

  @Input() list: UserList | null = null;
  @Input() detailComponent: Type<any>;
  series: SerieDetalle[] = [];
  userId: string | undefined;
  updated = false;

  constructor(
    private modalCtrl: ModalController,
    private userListService: UserListService,
    private auth: Auth
  ) { }

  ngOnInit() {
    this.userId = this.auth.currentUser?.uid;
    if (this.list && this.userId) {
      this.loadSeries();
    }
  }

  async loadSeries() {
    if (!this.list || !this.userId) return;
    try {
      this.series = await this.userListService.getFullSeriesDetailsFromList(this.list.id, this.userId);
    } catch (error) {
      console.error('Error loading series from list', error);
    }
  }

  close() {
    this.modalCtrl.dismiss({
        updated: this.updated
    });
  }

  async openSerieDetail(serie: SerieDetalle) {
    if (!this.detailComponent) {
      console.error('detailComponent was not passed to UserListDetailComponent');
      return;
    }

    const newModal = await this.modalCtrl.create({
      component: this.detailComponent,
      componentProps: { id: serie.id }
    });

    // Dismiss the current modal and then present the new one.
    // This avoids issues with stacked modals and animations.
    await this.modalCtrl.dismiss();
    await newModal.present();
  }
}
