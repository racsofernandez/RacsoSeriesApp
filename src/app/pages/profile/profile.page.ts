import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ConfigService} from "../../services/config.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
    user = this.authService.getUsuario();
    appVersion = '';

    constructor(private authService: AuthService, private config: ConfigService, private router: Router) {
        this.appVersion = config.config.version;
    }

    logout() {
        this.authService.logout();
    }

    goVerification() {
        this.router.navigate(['/verify-email']);
    }

}

