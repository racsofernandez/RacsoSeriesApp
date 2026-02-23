import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppUser, Language, SeriesDetail } from "../interfaces/interfaces";
import { ToastController } from "@ionic/angular";
import { MoviesService } from "./movies.service";
import { firstValueFrom } from 'rxjs';
import {ConfigService} from "./config.service";
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class SeriesDbService {

    urlBackend = '';
    peliculas: SeriesDetail[] = [];
    appUser: AppUser | null = null;

    constructor(
        private http: HttpClient,
        private toastCtrl: ToastController,
        private moviesService: MoviesService,
        private config: ConfigService,
        private injector: Injector
    ) {
        this.urlBackend = config.config.apiBackendUrl + "/users";
    }

    private get translate(): TranslateService {
        return this.injector.get(TranslateService);
    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 1500
        });
        await toast.present();
    }

    /**
     * Crea un nuevo usuario en el backend.
     * Devuelve el AppUser y lo guarda en la variable global.
     */
    async crearUsuario(userId: string): Promise<AppUser> {
        const url = `${this.urlBackend}/${userId}?languageId=1`;
        try {
            const user = await firstValueFrom(this.http.post<AppUser>(url, {}));
            this.appUser = user;
            return user;
        } catch (err) {
            console.error('Error creando usuario', err);
            await this.presentToast('Error al crear usuario');
            throw err;
        }
    }

    /**
     * Obtiene el usuario del backend.
     */
    async getUsuario(userId: string): Promise<AppUser> {
        const url = `${this.urlBackend}/${userId}`;
        try {
            const user = await firstValueFrom(this.http.get<AppUser>(url));
            this.appUser = user;
            return user;
        } catch (err) {
            console.error('Error obteniendo usuario', err);
            // Si no existe, lo creamos (opcional, depende de la lógica de negocio)
            // return this.crearUsuario(userId);
            throw err;
        }
    }

    /**
     * Actualiza el idioma del usuario.
     */
    async updateLanguage(userId: string, languageId: number): Promise<AppUser> {
        const url = `${this.urlBackend}/${userId}/language?languageId=${languageId}`;
        try {
            const user = await firstValueFrom(this.http.put<AppUser>(url, {}));
            this.appUser = user;
            const msg = await this.translate.get('PROFILE.LANGUAGE_UPDATED').toPromise();
            await this.presentToast(msg);
            return user;
        } catch (err) {
            console.error('Error actualizando idioma', err);
            const msg = await this.translate.get('PROFILE.LANGUAGE_UPDATE_ERROR').toPromise();
            await this.presentToast(msg);
            throw err;
        }
    }

    /**
     * Obtiene la lista de idiomas disponibles.
     * (Asumiendo que existe un endpoint para esto, si no, se puede hardcodear o crear otro servicio)
     */
    async getLanguages(): Promise<Language[]> {
        // Asumiendo que el endpoint de idiomas está en la raíz o en otro path
        // Ajusta la URL según tu API. Por ahora usaré una URL relativa a la base.
        const url = `${this.config.config.apiBackendUrl}/utils/languages`;
        try {
            return await firstValueFrom(this.http.get<Language[]>(url));
        } catch (err) {
            console.error('Error obteniendo idiomas', err);
            return [];
        }
    }


    /**
     * Llama al backend para alternar favorito.
     * Devuelve true si se añadió, false si se eliminó.
     */
    async guardarSerie(userId: string, serie: SeriesDetail): Promise<boolean> {
        const url = `${this.urlBackend}/${encodeURIComponent(userId)}/series/${serie.id}/toggle`;

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
    async cargarSeriesFavoritas(uid: string): Promise<SeriesDetail[]> {
        const url = `${this.urlBackend}/${encodeURIComponent(uid)}/series`;
        try {
            const favs = await firstValueFrom(
                this.http.get<Array<{ id: number, name?: string }>>(url)
            );
            const favoritas: SeriesDetail[] = [];

            for (const f of favs) {
                try {
                    // moviesService.getPeliculaDetalle devuelve un Observable
                    // Usamos firstValueFrom para convertirlo a Promise
                    const detalle: SeriesDetail = await firstValueFrom(this.moviesService.getPeliculaDetalle(f.id));
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
                            // Rellena otros campos vacíos según tu interfaz SeriesDetail
                        } as SeriesDetail);
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
        const url = `${this.urlBackend}/${encodeURIComponent(userId)}/series/${id}/exists`;
        try {
            const resp: any = await firstValueFrom(this.http.get(url));
            return resp && resp.exists === true;
        } catch (err) {
            console.error('Error comprobando existencia', err);
            return false;
        }
    }
}
