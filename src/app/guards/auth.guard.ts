import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    async canActivate(): Promise<boolean> {

        if (!Capacitor.isNativePlatform()) {
            // 🌐 WEB → AngularFire
            const { getAuth } = await import('firebase/auth');
            const auth = getAuth();
            if (auth.currentUser) return true;
        } else {
            // 📱 MOBILE → Capacitor plugin
            const { user } = await FirebaseAuthentication.getCurrentUser();
            if (user) return true;
        }

        await this.router.navigate(['/login']);
        return false;
    }
}
