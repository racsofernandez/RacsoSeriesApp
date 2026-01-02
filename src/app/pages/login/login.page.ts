import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {ConfigService} from "../../services/config.service";
import {ToastController} from "@ionic/angular";
import {SplashService} from "../../shared/splash.service";

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
                private splash: SplashService) {
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
        try {
            const { user } = await this.authService.loginEmail(this.email, this.password);

            if (!user.emailVerified) {
                this.presentToast("Debes verificar tu correo antes de continuar.");
                return;
            }

            this.splash.show();
            this.router.navigateByUrl('/tabs/home', { replaceUrl: true });

        } catch (err: any) {
            this.presentToast("Error al iniciar sesión");
        }
    }

    async register() {
        try {
            await this.authService.registerEmail(this.email, this.password);
            await this.router.navigate(['/tabs/home']);
        } catch (error) {
            this.presentToast(`Error de registro. ${this.getErrorMessage(error)}`);
        }
    }

    async loginGoogle() {
        try {
            await this.authService.loginGoogle();
            await this.router.navigate(['/tabs/home']);
        } catch (error) {
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
