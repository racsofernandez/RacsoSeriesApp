import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {ConfigService} from "../../services/config.service";
import {ModalController, ToastController} from "@ionic/angular";
import {SplashService} from "../../shared/splash.service";
import {Capacitor} from "@capacitor/core";
import { RegisterUserComponent } from '../../components/register-user/register-user.component';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';
import { SeriesDbService } from '../../services/series-db.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
class LoginPage {
    email = '';
    password = '';

    appVersion = '';

    constructor(private authService: AuthService, private router: Router,
                config: ConfigService,
                private toastCtrl: ToastController,
                private splash: SplashService,
                private modalCtrl: ModalController,
                private seriesDbService: SeriesDbService) {
        console.log(config.config);
        this.appVersion = config.config.version;

    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1500
        });
        toast.present();
    }

    async login() {
        this.splash.show();
        try {
            const { user } = await this.authService.loginEmail(this.email, this.password);
            this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
        } catch (err: any) {
            this.splash.hide();
            this.presentToast("Error al iniciar sesión");
        }
    }

    async openRegisterModal() {
        const modal = await this.modalCtrl.create({
            component: RegisterUserComponent
        });
        await modal.present();
    }

    async loginGoogle() {
        this.splash.show();
        try {
            const { userCredential, isNewUser } = await this.authService.loginGoogle();
            
            if (isNewUser) {
                // Obtener usuario del backend para pasarlo al modal
                const appUser = await this.seriesDbService.getUsuario(userCredential.user.uid);
                
                const modal = await this.modalCtrl.create({
                    component: EditProfileComponent,
                    componentProps: { user: appUser }
                });
                await modal.present();
                await modal.onDidDismiss();
                
                // Redirigir después de cerrar el modal (haya guardado o no)
                this.router.navigate(['/tabs/home']);
            } else {
                this.router.navigate(['/tabs/home']);
            }

        } catch (error) {
            this.splash.hide();
            this.presentToast(`Error de login. ${this.getErrorMessage(error)}`);
        }
    }

    goForgot() {
        this.router.navigate(['/forgot']);
    }

    getErrorMessage(error: any): string {
        console.log(error);
        const errorMessage: string = error.message || error.toString();
        if(errorMessage.includes('auth/invalid-email')) {
            return 'Email inválido';
        } else if (errorMessage.includes('auth/missing-password')) {
            return 'Falta la contraseña';
        } else if (errorMessage.includes('auth/invalid-credential')) {
            return 'Credencial inválida';
        } else if (errorMessage.includes('auth/email-already-in-use')) {
            return 'Email existente';
        } else if (errorMessage.includes('auth/weak-password')) {
            return 'Contraseña incorrecta, debe tener al menos 6 caracteres';
        }
        return `Error no registrado: ${errorMessage}`;
    }

}

export default LoginPage
