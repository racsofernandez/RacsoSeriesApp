import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { SeriesDbService } from '../../services/series-db.service';
import { TranslateService } from '@ngx-translate/core';
import { AppUser } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  @Input() user: AppUser;
  profileForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private seriesDbService: SeriesDbService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      alias: [this.user?.alias || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  async saveProfile() {
    if (this.profileForm.invalid || !this.user) {
      return;
    }

    this.isLoading = true;
    try {
      await this.seriesDbService.updateUser(this.user.id, { alias: this.profileForm.value.alias });
      const successMsg = await this.translate.get('EDIT_PROFILE.SUCCESS_MSG').toPromise();
      await this.seriesDbService.presentToast(successMsg, 'success');
      this.closeModal(true);
    } catch (error: any) {
      let errorMsgKey = 'EDIT_PROFILE.DEFAULT_ERROR';
      if (error.status === 409) {
        errorMsgKey = 'REGISTER.ERROR_ALIAS_IN_USE';
      }
      const errorMsg = await this.translate.get(errorMsgKey).toPromise();
      await this.seriesDbService.presentToast(errorMsg, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  closeModal(updated = false) {
    this.modalCtrl.dismiss({ updated });
  }
}
