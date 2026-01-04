import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ConfigService} from "../../services/config.service";
import {Router} from "@angular/router";
import {User} from "@angular/fire/auth";
import {Observable} from "rxjs";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
    user$: Observable<User | null>;
    appVersion = '';

    constructor(private authService: AuthService, private config: ConfigService, private router: Router) {
        this.user$ = this.authService.user$;
        this.appVersion = config.config.version;
    }

    logout() {
        this.authService.logout();
    }

    goVerification() {
        this.router.navigate(['/verify-email']);
    }

}

