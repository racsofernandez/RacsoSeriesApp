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

    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(private platform: Platform, private auth: Auth, private router: Router,
                private ngZone: NgZone, private seriesDbService: SeriesDbService,
                private moviesService: MoviesService) {

        onAuthStateChanged(this.auth, async user => {
            this.ngZone.run(async () => {
                this.userSubject.next(user);

                if (user) {
                    try {
                        const appUser = await this.seriesDbService.getUsuario(user.uid);
                        if (appUser && appUser.language) {
                            this.moviesService.setLanguage(appUser.language.code);
                        }
                    } catch (e) {
                        console.error("Error cargando idioma del usuario", e);
                    }
                } else {
                    // Solo redirigir a login si no estamos ya en una ruta pública
                    if (!this.router.url.includes('login') && !this.router.url.includes('forgot')) {
                         this.router.navigateByUrl('/login', { replaceUrl: true });
                    }
                }
            });
        });
    }

    async loginEmail(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    async registerEmail(email: string, password: string, alias: string) {
        const cred = await createUserWithEmailAndPassword(this.auth, email, password);
        await sendEmailVerification(cred.user);
        await this.seriesDbService.crearUsuario(cred.user.uid, alias);
        return cred;
    }

    async loginGoogle() {
        await this.platform.ready();
        let userCredential;
        let isNewUser = false;

        if (Capacitor.isNativePlatform()) {
            const result = await FirebaseAuthentication.signInWithGoogle({ scopes: ['email', 'profile'] });
            if (!result.credential?.idToken) throw new Error('No Google ID token received');
            const credential = GoogleAuthProvider.credential(result.credential.idToken);
            userCredential = await signInWithCredential(this.auth, credential);
        } else {
            const provider = new GoogleAuthProvider();
            userCredential = await signInWithPopup(this.auth, provider);
        }

        const additionalInfo = getAdditionalUserInfo(userCredential);
        isNewUser = !!additionalInfo?.isNewUser;

        if (isNewUser) {
            console.log('Usuario nuevo de Google, creando en backend...');
            const alias = userCredential.user.email?.split('@')[0] || userCredential.user.uid;
            await this.seriesDbService.crearUsuario(userCredential.user.uid, alias);
        }

        return { userCredential, isNewUser };
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

    async resendVerification() {
        const user = this.auth.currentUser;
        if (user) return sendEmailVerification(user);
        throw new Error("No hay usuario autenticado");
    }

    isEmailVerified(user: User) {
        return user.emailVerified;
    }

    getUsuario() {
        return this.auth.currentUser;
    }

    async getIdToken(forceRefresh = false): Promise<string | null> {
        const user = this.auth.currentUser;
        if (user) return user.getIdToken(forceRefresh);
        return null;
    }
}
