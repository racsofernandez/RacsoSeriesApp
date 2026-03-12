import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  return password && repeatPassword && password.value !== repeatPassword.value ? { passwordsDontMatch: true } : null;
};

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      alias: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator });
  }

  closeModal(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  get email() { return this.registerForm.get('email'); }
  get alias() { return this.registerForm.get('alias'); }
  get password() { return this.registerForm.get('password'); }
  get repeatPassword() { return this.registerForm.get('repeatPassword'); }

  async register() {
    if (this.registerForm.invalid) {
      return;
    }

    const { email, password, alias } = this.registerForm.value;

    try {
      await this.authService.registerEmail(email, password, alias);
      const successMsg = await this.translate.get('REGISTER.SUCCESS_MSG').toPromise();
      this.presentToast(successMsg, 'success');
      this.closeModal({ registered: true });
    } catch (error: any) {
      const errorMsg = this.getErrorMessage(error);
      this.presentToast(errorMsg, 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: color
    });
    await toast.present();
  }

  getErrorMessage(error: any): string {
    const code = error.code || '';
    const httpStatus = error.status;
    let key = 'REGISTER.DEFAULT_ERROR';

    if (code === 'auth/invalid-email') {
      key = 'REGISTER.ERROR_INVALID_EMAIL';
    } else if (code === 'auth/email-already-in-use') {
      key = 'REGISTER.ERROR_EMAIL_IN_USE';
    } else if (code === 'auth/weak-password') {
      key = 'REGISTER.ERROR_WEAK_PASSWORD';
    } else if (httpStatus === 409) { // Conflicto, ej. alias duplicado
      key = 'REGISTER.ERROR_ALIAS_IN_USE';
    }
    
    return this.translate.instant(key);
  }
}
