import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController, ToastController} from '@ionic/angular';

@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.page.html',
    styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage {

    email = '';

    constructor(private authService: AuthService,
                private toastCtrl: ToastController,
                private navCtrl: NavController) {}

    async sendReset() {
        try {
            await this.authService.resetPassword(this.email);
            this.presentToast("Te hemos enviado un enlace para restablecer tu contraseña.");
        } catch (err) {
            this.presentToast("No se pudo enviar el correo.");
        }
    }

    regresar() {
        this.navCtrl.back();
    }

    async presentToast(msg:string) {
        const toast = await this.toastCtrl.create({ message: msg, duration: 1500 });
        toast.present();
    }
}
