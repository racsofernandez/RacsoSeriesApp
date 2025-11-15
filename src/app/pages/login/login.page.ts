import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {ConfigService} from "../../services/config.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage {
    email = '';
    password = '';

    appVersion = '';

    constructor(private authService: AuthService, private router: Router, config: ConfigService) {
        console.log(config.config);
        this.appVersion = config.config.version;
    }

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
