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
    sendPasswordResetEmail, sendEmailVerification, signInWithCredential, authState
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {getApps} from "@angular/fire/app";
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {Capacitor} from "@capacitor/core";
import {Platform} from "@ionic/angular";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // usuario: User | null = null;
    // token: string | null = null;

    /** 🔥 ÚNICA fuente de verdad */
    // user$: Observable<User | null> = authState(this.auth);

    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(private platform: Platform, private auth: Auth, private router: Router,
                private ngZone: NgZone) {
        // this.platform.ready().then(() => {
        //
        //     if (!Capacitor.isNativePlatform()) {
        //         // 🌐 WEB
        //         onAuthStateChanged(this.auth, (user) => {
        //             this.ngZone.run(() => {
        //                 if (!user) this.router.navigate(['/login']);
        //             });
        //         });
        //     }
        //
        // });

        onAuthStateChanged(this.auth, user => {
            this.ngZone.run(() => {
                this.userSubject.next(user);

                if (user) {
                    this.router.navigateByUrl('/tabs', { replaceUrl: true });
                } else {
                    this.router.navigateByUrl('/login', { replaceUrl: true });
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
            // 1️⃣ Login nativo
            const result = await FirebaseAuthentication.signInWithGoogle({
                scopes: ['email', 'profile'],
            });

            // 2️⃣ Token Firebase
            if (!result.credential?.idToken) {
                throw new Error('No Google ID token received');
            }

            const credential = GoogleAuthProvider.credential(result.credential.idToken);

            // 4️⃣ Sincronizar AngularFire
            return await signInWithCredential(this.auth, credential);
        }
        else {
            // ✅ WEB
            const provider = new GoogleAuthProvider();
            return signInWithPopup(this.auth, provider);
        }
    }

    async logout() {
        if (Capacitor.isNativePlatform()) {
            await FirebaseAuthentication.signOut();
        }
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
        return this.auth.currentUser;
    }

    async getIdToken(): Promise<string | null> {
        return this.auth.currentUser?.getIdToken() ?? null;
    }

}
