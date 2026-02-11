import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserListService } from '../../services/user-list.service';
import { Auth } from '@angular/fire/auth';
import { UserList } from '../../interfaces/interfaces';
import { UserListModalComponent } from '../../components/user-list-modal/user-list-modal.component';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

  lists: UserList[] = [];
  loading = true;

  constructor(
    private userListService: UserListService,
    private auth: Auth,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    // Carga inicial
  }

  async ionViewWillEnter() {
    await this.loadLists();
  }

  async loadLists(event?: any) {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      this.loading = false;
      if (event) event.target.complete();
      return;
    }

    try {
      this.lists = await this.userListService.getUserLists(userId);
    } catch (error) {
      console.error('Error loading lists', error);
    } finally {
      this.loading = false;
      if (event) event.target.complete();
    }
  }

  async openListModal(list?: UserList) {
    const modal = await this.modalCtrl.create({
      component: UserListModalComponent,
      componentProps: { list: list || null }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.updated) {
      this.loadLists();
    }
  }

  doRefresh(event: any) {
    this.loadLists(event);
  }
}
