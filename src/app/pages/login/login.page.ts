import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage {
    email = '';
    password = '';

    appVersion = environment.version;

    constructor(private authService: AuthService, private router: Router) {}

    async login() {
        try {
            await this.authService.loginEmail(this.email, this.password);
            await this.router.navigate(['/tabs/home']);
        } catch (error) {
            console.error(error);
        }
    }

    async register() {
        try {
            await this.authService.registerEmail(this.email, this.password);
            await this.router.navigate(['/tabs/home']);
        } catch (error) {
            console.error(error);
        }
    }

    async loginGoogle() {
        try {
            await this.authService.loginGoogle();
            await this.router.navigate(['/tabs/home']);
        } catch (error) {
            console.error(error);
        }
    }
}
