import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, deleteDoc, setDoc, getDoc }
    from '@angular/fire/firestore';
import {PeliculaDetalle} from "../interfaces/interfaces";
import {ToastController} from "@ionic/angular";
import {MoviesService} from "./movies.service";

@Injectable({
    providedIn: 'root'
})
export class SeriesDbService {

    peliculas: PeliculaDetalle[] = [];

    constructor(private firestore: Firestore,
                private toastCtrl: ToastController,
                private moviesService: MoviesService) {
    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1500
        });
        toast.present();
    }

    async guardarSerie(userId: string, serie: PeliculaDetalle) {

        const ref = doc(this.firestore,
            `Favourites/${userId}/series/${serie.id}`
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {
            await deleteDoc(ref);
            return false; // dejado de ser favorito
        } else {
            await setDoc(ref, { id: serie.id, name: serie.name });
            return true;  // añadido como favorito
        }
    }

    async cargarSeriesFavoritas(uid: string): Promise<PeliculaDetalle[]> {

        const colRef = collection(this.firestore, `Favourites/${uid}/series`);
        const snapshot = await getDocs(colRef);

        // sacamos IDs de las pelis favoritas
        const ids = snapshot.docs.map(doc => Number(doc.id));

        const favoritas: PeliculaDetalle[] = [];

        for (const id of ids) {
            const detalle = await this.moviesService.getPeliculaDetalle(id).toPromise();
            if (detalle) favoritas.push(detalle);
        }

        return favoritas;
    }

    async existeSerie(userId: string, id: number) {
        const ref = doc(
            this.firestore,
            `Favourites/${userId}/series/${id}`
        );
        const snap = await getDoc(ref);
        return snap.exists();
    }

}
