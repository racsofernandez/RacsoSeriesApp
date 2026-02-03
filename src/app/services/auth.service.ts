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
    sendPasswordResetEmail, sendEmailVerification, signInWithCredential, authState, getAdditionalUserInfo
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {getApps} from "@angular/fire/app";
import {FirebaseAuthentication} from "@capacitor-firebase/authentication";
import {Capacitor} from "@capacitor/core";
import {Platform} from "@ionic/angular";
import {BehaviorSubject} from "rxjs";
import {SeriesDbService} from "./series-db.service";
import {MoviesService} from "./movies.service";

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
                private ngZone: NgZone, private seriesDbService: SeriesDbService,
                private moviesService: MoviesService) {
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

        onAuthStateChanged(this.auth, async user => {
            this.ngZone.run(async () => {
                this.userSubject.next(user);

                if (user) {
                    // Cargar idioma del usuario al autenticarse
                    try {
                        const appUser = await this.seriesDbService.getUsuario(user.uid);
                        if (appUser && appUser.language) {
                            this.moviesService.setLanguage(appUser.language.code);
                        }
                    } catch (e) {
                        console.error("Error cargando idioma del usuario", e);
                    }

                    // this.router.navigateByUrl('/tabs', { replaceUrl: true });
                    // No navegamos aquí automáticamente para evitar conflictos con el login manual
                    // que ya maneja la navegación y el splash.
                    // Solo si estamos en login y detectamos usuario (autologin), navegamos.
                    if (this.router.url.includes('login')) {
                         this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
                    }

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

        // Crear usuario en backend
        await this.seriesDbService.crearUsuario(cred.user.uid);

        return cred;
    }

    async loginGoogle() {
        await this.platform.ready(); // 🔴 CLAVE

        let userCredential;

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
            userCredential = await signInWithCredential(this.auth, credential);
        }
        else {
            // ✅ WEB
            const provider = new GoogleAuthProvider();
            userCredential = await signInWithPopup(this.auth, provider);
        }

        // Comprobar si el usuario es nuevo consultando nuestro backend.
        // Es más fiable que getAdditionalUserInfo, que falla en nativo.
        const uid = userCredential.user.uid;
        try {
            await this.seriesDbService.getUsuario(uid);
            // Si la promesa se resuelve, el usuario ya existe. No hacemos nada.
        } catch (error) {
            // Si la promesa falla (ej: error 404), el usuario es nuevo. Lo creamos.
            console.log('Usuario no encontrado en la base de datos, creando...');
            await this.seriesDbService.crearUsuario(uid);
        }

        return userCredential;
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

    async getIdToken(forceRefresh = false): Promise<string | null> {
        const user = this.auth.currentUser;
        if (user) {
            return user.getIdToken(forceRefresh);
        }
        return null;
    }

}
