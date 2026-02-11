import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { UserList, SerieDetalle } from '../../interfaces/interfaces';
import { UserListService } from '../../services/user-list.service';
import { Auth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { DetalleComponent } from '../detalle/detalle.component';

@Component({
  selector: 'app-user-list-modal',
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.scss'],
})
export class UserListModalComponent implements OnInit {

  @Input() list: UserList | null = null; // Si es null, es modo creación
  
  name: string = '';
  description: string = '';
  series: SerieDetalle[] = [];
  loading = false;
  isNew = true;

  constructor(
    private modalCtrl: ModalController,
    private userListService: UserListService,
    private auth: Auth,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    if (this.list) {
      this.isNew = false;
      this.name = this.list.name;
      this.description = this.list.description;
      await this.loadSeries();
    }
  }

  async loadSeries() {
    if (!this.list || !this.auth.currentUser) return;
    
    this.loading = true;
    try {
      this.series = await this.userListService.getFullSeriesDetailsFromList(this.list.id, this.auth.currentUser.uid);
    } catch (error) {
      console.error('Error loading series', error);
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async saveList() {
    if (!this.name.trim()) return;
    
    const userId = this.auth.currentUser?.uid;
    if (!userId) return;

    this.loading = true;
    try {
      if (this.isNew) {
        await this.userListService.createList({
          name: this.name,
          description: this.description,
          user_id: userId
        });
        this.presentToast('LISTS.CREATED_SUCCESS');
      } else if (this.list) {
        await this.userListService.updateList(this.list.id, {
          name: this.name,
          description: this.description,
          user_id: userId
        });
        this.presentToast('LISTS.UPDATED_SUCCESS');
      }
      this.modalCtrl.dismiss({ updated: true });
    } catch (error) {
      console.error('Error saving list', error);
      this.presentToast('COMMON.ERROR');
    } finally {
      this.loading = false;
    }
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: await this.translate.get('LISTS.DELETE_CONFIRM_TITLE').toPromise(),
      message: await this.translate.get('LISTS.DELETE_CONFIRM_MSG').toPromise(),
      buttons: [
        {
          text: await this.translate.get('COMMON.CANCEL').toPromise(),
          role: 'cancel'
        },
        {
          text: await this.translate.get('COMMON.DELETE').toPromise(),
          role: 'destructive',
          handler: () => this.deleteList()
        }
      ]
    });
    await alert.present();
  }

  async deleteList() {
    if (!this.list || !this.auth.currentUser) return;

    this.loading = true;
    try {
      await this.userListService.deleteList(this.list.id, this.auth.currentUser.uid);
      this.presentToast('LISTS.DELETED_SUCCESS');
      this.modalCtrl.dismiss({ updated: true });
    } catch (error) {
      console.error('Error deleting list', error);
      this.presentToast('COMMON.ERROR');
    } finally {
      this.loading = false;
    }
  }

  async removeSeries(seriesId: number) {
    const alert = await this.alertCtrl.create({
      header: await this.translate.get('LISTS.REMOVE_SERIES_CONFIRM_TITLE').toPromise(),
      message: await this.translate.get('LISTS.REMOVE_SERIES_CONFIRM_MSG').toPromise(),
      buttons: [
        {
          text: await this.translate.get('COMMON.CANCEL').toPromise(),
          role: 'cancel'
        },
        {
          text: await this.translate.get('COMMON.DELETE').toPromise(),
          role: 'destructive',
          handler: () => this.executeRemoveSeries(seriesId)
        }
      ]
    });
    await alert.present();
  }

  async executeRemoveSeries(seriesId: number) {
    if (!this.list || !this.auth.currentUser) return;

    // Optimistic update
    const originalSeries = [...this.series];
    this.series = this.series.filter(s => s.id !== seriesId);

    try {
      await this.userListService.removeSeriesFromList(this.list.id, seriesId, this.auth.currentUser.uid);
    } catch (error) {
      console.error('Error removing series', error);
      this.series = originalSeries; // Revert
      this.presentToast('COMMON.ERROR');
    }
  }

  async verDetalle(id: number) {
    const modal = await this.modalCtrl.create({
      component: DetalleComponent,
      componentProps: { id }
    });
    await modal.present();
  }

  async presentToast(key: string) {
    const message = await this.translate.get(key).toPromise();
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    await toast.present();
  }
}
