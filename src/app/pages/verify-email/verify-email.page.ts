import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController, ToastController} from '@ionic/angular';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.page.html',
    styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {

    constructor(private authService: AuthService,
                private toastCtrl: ToastController,
                private navCtrl: NavController) {}

    async resend() {
        try {
            await this.authService.resendVerification();
            this.presentToast("Correo de verificación enviado nuevamente.");
        } catch (err) {
            this.presentToast("Error enviando verificación.");
        }
    }

    regresar() {
        this.navCtrl.back();
    }

    async presentToast(msg:string) {
        const t = await this.toastCtrl.create({message: msg, duration: 1500});
        t.present();
    }
}

