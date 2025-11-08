import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
    user = this.authService.getUsuario();

    constructor(private authService: AuthService) {}

    logout() {
        this.authService.logout();
    }
}

