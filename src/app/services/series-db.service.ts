import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeliculaDetalle } from "../interfaces/interfaces";
import { ToastController } from "@ionic/angular";
import { MoviesService } from "./movies.service";
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SeriesDbService {

    peliculas: PeliculaDetalle[] = [];

    // Ajusta la URL base según tu backend (ej: http://localhost:8080)
    private readonly API_BASE_URL = 'http://localhost:8080/api/v1/users';

    constructor(
        private http: HttpClient,
        private toastCtrl: ToastController,
        private moviesService: MoviesService
    ) { }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1500
        });
        await toast.present();
    }

    /**
     * Llama al backend para alternar favorito.
     * Devuelve true si se añadió, false si se eliminó.
     */
    async guardarSerie(userId: string, serie: PeliculaDetalle): Promise<boolean> {
        const url = `${this.API_BASE_URL}/${encodeURIComponent(userId)}/series/${serie.id}/toggle`;

        try {
            // Enviar "name" como query param, no en el body
            const params = { name: serie.name ?? '' };
            const resp = await firstValueFrom(
                this.http.post<{ favorite: boolean }>(url, null, { params })
            );
            const added = resp.favorite === true;
            await this.presentToast(
                added ? 'Añadido a favoritos' : 'Eliminado de favoritos'
            );
            return added;
        } catch (err) {
            console.error('Error toggling favorite', err);
            await this.presentToast('Error al guardar favorito');
            throw err;
        }
    }

    /**
     * Carga los favoritos desde el backend y consigue los detalles usando MoviesService
     */
    async cargarSeriesFavoritas(uid: string): Promise<PeliculaDetalle[]> {
        const url = `${this.API_BASE_URL}/${encodeURIComponent(uid)}/series`;
        try {
            const favs = await firstValueFrom(
                this.http.get<Array<{ id: number, name?: string }>>(url)
            );
            const favoritas: PeliculaDetalle[] = [];

            for (const f of favs) {
                try {
                    // moviesService.getPeliculaDetalle devuelve un Observable
                    // Usamos firstValueFrom para convertirlo a Promise
                    const detalle: PeliculaDetalle = await firstValueFrom(this.moviesService.getPeliculaDetalle(f.id));
                    if (detalle) {
                        favoritas.push(detalle);
                    }
                } catch (err) {
                    console.warn(`No se pudo obtener detalle para id=${f.id}`, err);
                    // si quieres, podemos construir un objeto mínimo con id y name:
                    if (f.name) {
                        favoritas.push({
                            id: f.id,
                            name: f.name,
                            // Rellena otros campos vacíos según tu interfaz PeliculaDetalle
                        } as PeliculaDetalle);
                    }
                }
            }

            this.peliculas = favoritas;
            return favoritas;
        } catch (err) {
            console.error('Error cargando favoritos', err);
            await this.presentToast('Error al cargar favoritos');
            return [];
        }
    }

    /**
     * Comprueba existencia en backend
     */
    async existeSerie(userId: string, id: number): Promise<boolean> {
        const url = `${this.API_BASE_URL}/${encodeURIComponent(userId)}/series/${id}/exists`;
        try {
            const resp: any = await firstValueFrom(this.http.get(url));
            return resp && resp.exists === true;
        } catch (err) {
            console.error('Error comprobando existencia', err);
            return false;
        }
    }
}
