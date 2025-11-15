import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ConfigService} from "../../services/config.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
    user = this.authService.getUsuario();
    appVersion = '';

    constructor(private authService: AuthService, private config: ConfigService) {
        this.appVersion = config.config.version;
    }

    logout() {
        this.authService.logout();
    }
}

