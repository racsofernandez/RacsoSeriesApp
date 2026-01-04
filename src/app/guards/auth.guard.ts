import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import {Auth} from "@angular/fire/auth";
import {map, Observable, take} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private auth: Auth, private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.user$.pipe(
            take(1),
            map(user => {
                if (user) return true;
                this.router.navigate(['/login']);
                return false;
            })
        );
    }

    // async canActivate(): Promise<boolean> {
    //
    //     if (!Capacitor.isNativePlatform()) {
    //         console.log('Capacitor: canActivate(), currentUser: {}', this.auth.currentUser?.email);
    //         // 🌐 WEB → AngularFire
    //         const user = this.auth.currentUser;
    //         if (user) return true;
    //     } else {
    //         // 📱 MOBILE → Capacitor plugin
    //         const { user } = await FirebaseAuthentication.getCurrentUser();
    //         if (user) return true;
    //     }
    //
    //     await this.router.navigate(['/login']);
    //     return false;
    // }
}
