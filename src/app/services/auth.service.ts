import {inject, Injectable, NgZone} from '@angular/core';
import {
    Auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    User,
    sendPasswordResetEmail, sendEmailVerification
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {getApps} from "@angular/fire/app";
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {Capacitor} from "@capacitor/core";
import {Platform} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    usuario: User | null = null;

    constructor(private platform: Platform, private auth: Auth, private router: Router,
                private ngZone: NgZone) {
        onAuthStateChanged(this.auth, (user) => {
            this.usuario = user;
            console.log('Firebase apps:', getApps());
            if (!user) {
                this.router.navigate(['/login']);
            }
        });

        FirebaseAuthentication.addListener('idTokenChange', async ({ token }) => {
                console.log('🔥 ID TOKEN CHANGE:', token);

            this.ngZone.run(() => {
                if (token) {
                    this.router.navigate(['/tabs/home']);
                } else {
                    this.router.navigate(['/login']);
                }
            });
        });


    }

    async loginEmail(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    async registerEmail(email: string, password: string) {
        const cred = await createUserWithEmailAndPassword(this.auth, email, password);

        // Enviar email de verificación
        await sendEmailVerification(cred.user);

        return cred;
    }

    async loginGoogle() {
        await this.platform.ready(); // 🔴 CLAVE

        if (Capacitor.isNativePlatform()) {
            // ✅ ANDROID / IOS
            return await FirebaseAuthentication.signInWithGoogle({
   scopes: ['email', 'profile'],
         });
        }
        else {
            // ✅ WEB
            const provider = new GoogleAuthProvider();
            return signInWithPopup(this.auth, provider);
        }
    }

    async logout() {
        await signOut(this.auth);
        this.router.navigate(['/login']);
    }

    resetPassword(email: string) {
        return sendPasswordResetEmail(this.auth, email);
    }

    // Reenviar verificación
    async resendVerification() {
        const user = this.auth.currentUser;
        if (user) {
            return sendEmailVerification(user);
        }
        throw new Error("No hay usuario autenticado");
    }

    // Saber si está verificado
    isEmailVerified(user: User) {
        return user.emailVerified;
    }

    getUsuario() {
        return this.usuario;
    }

    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    async getIdToken(): Promise<string | null> {
        const user = this.auth.currentUser;
        if (!user) return null;

        return await user.getIdToken(); // 🔑 TOKEN REAL
    }

}
