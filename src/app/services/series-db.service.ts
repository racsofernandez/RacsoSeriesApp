import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, deleteDoc, setDoc, getDoc }
    from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import {PeliculaDetalle} from "../interfaces/interfaces";
import {ToastController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class SeriesDbService {

    private favoritosCargados = false;

    peliculas: PeliculaDetalle[] = [];

    constructor(private firestore: Firestore,
                private toastCtrl: ToastController) {
        // this.cargarFavoritos();
    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1500
        });
        toast.present();
    }

    async guardarPelicula(pelicula: PeliculaDetalle) {
        const ref = doc(this.firestore, 'favoritos', pelicula.id.toString());
        const snap = await getDoc(ref);

        if (snap.exists()) {
            await deleteDoc(ref);
            return false;
        } else {
            await setDoc(ref, pelicula);
            return true;
        }
    }

    async getFavoritos(): Promise<PeliculaDetalle[]> {
        if (!this.favoritosCargados) {
            this.peliculas = await this.cargarFavoritos();
            this.favoritosCargados = true;
        }
        return this.peliculas;
    }

    async cargarFavoritos(): Promise<PeliculaDetalle[]> {
        const colRef = collection(this.firestore, 'favoritos');
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(d => d.data() as PeliculaDetalle);
    }

    async existePelicula(id: number) {
        const ref = doc(this.firestore, 'favoritos', id.toString());
        const snap = await getDoc(ref);
        return snap.exists();
    }
}
