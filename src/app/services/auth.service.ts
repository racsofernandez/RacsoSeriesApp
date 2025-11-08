import {inject, Injectable} from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {getApps} from "@angular/fire/app";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    usuario: User | null = null;

    constructor(private auth: Auth, private router: Router) {
        onAuthStateChanged(this.auth, (user) => {
            this.usuario = user;
            console.log('Firebase apps:', getApps());
            if (!user) {
                this.router.navigate(['/login']);
            }
        });
    }

    async loginEmail(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    async registerEmail(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }

    async loginGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    async logout() {
        await signOut(this.auth);
        this.router.navigate(['/login']);
    }

    getUsuario() {
        return this.usuario;
    }
}
