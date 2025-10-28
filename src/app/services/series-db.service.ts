import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import {PeliculaDetalle} from "../interfaces/interfaces";
import {ToastController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class SeriesDbService {

    peliculas: PeliculaDetalle[] = [];

    constructor(private firestore: AngularFirestore,
                private toastCtrl: ToastController) {
        this.cargarFavoritos();
    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1500
        });
        toast.present();
    }

    async guardarPelicula(pelicula: PeliculaDetalle) {
        const existe = await this.existePelicula(pelicula.id);

        if (existe) {
            // Si ya existe, eliminar de favoritos
            await this.firestore.collection('favoritos').doc(pelicula.id.toString()).delete();
            console.log(`Película ${pelicula.name} eliminada de favoritos`);
        } else {
            // Si no existe, añadir
            await this.firestore.collection('favoritos').doc(pelicula.id.toString()).set(pelicula);
            console.log(`Película ${pelicula.name} añadida a favoritos`);
        }

        // Actualiza la lista local
        this.cargarFavoritos();

        return !existe;
    }

    async cargarFavoritos() {
        const snapshot = await this.firestore.collection<PeliculaDetalle>('favoritos').get().toPromise();
        const peliculas: PeliculaDetalle[] = [];
        snapshot?.forEach(doc => peliculas.push(doc.data()));
        return peliculas;

    }

    async existePelicula(id: number): Promise<boolean> {
        const doc = await this.firestore.collection('favoritos').doc(id.toString()).get().toPromise();
        return doc?.exists || false;
    }
}
