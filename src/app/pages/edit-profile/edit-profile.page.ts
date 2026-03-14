import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { SeriesDbService } from '../../services/series-db.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  profileForm: FormGroup;
  userId: string;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService,
    private seriesDbService: SeriesDbService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    this.profileForm = this.fb.group({
      alias: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.userId = this.authService.getUsuario()!.uid;
    if (this.userId) {
      await this.loadUserData();
    } else {
      this.navCtrl.back();
    }
  }

  async loadUserData() {
    this.isLoading = true;
    try {
      const user = await this.seriesDbService.getUsuario(this.userId);
      this.profileForm.patchValue({ alias: user.alias });
    } catch (error) {
      console.error('Error loading user data', error);
      this.seriesDbService.presentToast('Error al cargar los datos', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async saveProfile() {
    if (this.profileForm.invalid || !this.userId) {
      return;
    }

    this.isLoading = true;
    try {
      await this.seriesDbService.updateUser(this.userId, { alias: this.profileForm.value.alias });
      const successMsg = await this.translate.get('EDIT_PROFILE.SUCCESS_MSG').toPromise();
      await this.seriesDbService.presentToast(successMsg, 'success');
      this.navCtrl.back();
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

  goBack() {
    this.navCtrl.back();
  }
}
