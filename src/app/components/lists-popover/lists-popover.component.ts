import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserList } from '../../interfaces/interfaces';

@Component({
  selector: 'app-lists-popover',
  template: `
    <ion-list>
      <ion-item button (click)="selectAction('create')">
        <ion-icon name="add-circle-outline" slot="start"></ion-icon>
        <ion-label>{{ 'LISTS.CREATE_NEW' | translate }}</ion-label>
      </ion-item>
      
      <ion-item *ngFor="let list of lists" button (click)="selectAction('add', list)">
        <ion-icon name="list-outline" slot="start"></ion-icon>
        <ion-label>{{ list.name }}</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    ion-list {
      padding: 0;
    }
    ion-item {
      --min-height: 48px;
      cursor: pointer;
    }
  `]
})
export class ListsPopoverComponent {
  @Input() lists: UserList[] = [];

  constructor(private popoverCtrl: PopoverController) {}

  selectAction(action: 'create' | 'add', list?: UserList) {
    this.popoverCtrl.dismiss({ action, list });
  }
}
