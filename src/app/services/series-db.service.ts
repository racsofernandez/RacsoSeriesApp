import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

    async presentToast(message: string, color: string = 'primary') {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            color
        });
        await toast.present();
    }

    async crearUsuario(userId: string, alias: string): Promise<AppUser> {
        const url = `${this.urlBackend}/${userId}?languageId=1&alias=${encodeURIComponent(alias)}`;
        try {
            const user = await firstValueFrom(this.http.post<AppUser>(url, {}));
            this.appUser = user;
            return user;
        } catch (err) {
            console.error('Error creando usuario', err);
            throw err;
        }
    }

    async getUsuario(userId: string): Promise<AppUser> {
        const url = `${this.urlBackend}/${userId}`;
        try {
            const user = await firstValueFrom(this.http.get<AppUser>(url));
            this.appUser = user;
            return user;
        } catch (err) {
            console.error('Error obteniendo usuario', err);
            throw err;
        }
    }

    async updateUser(userId: string, data: { alias?: string; languageId?: number }): Promise<AppUser> {
        const url = `${this.urlBackend}/${userId}`;
        let params = new HttpParams();
        if (data.alias) {
            params = params.set('alias', data.alias);
        }
        if (data.languageId) {
            params = params.set('languageId', data.languageId.toString());
        }

        try {
            const user = await firstValueFrom(this.http.put<AppUser>(url, {}, { params }));
            this.appUser = user;
            return user;
        } catch (err) {
            console.error('Error actualizando usuario', err);
            throw err;
        }
    }

    async updateLanguage(userId: string, languageId: number): Promise<AppUser> {
        try {
            const user = await this.updateUser(userId, { languageId });
            const msg = await this.translate.get('PROFILE.LANGUAGE_UPDATED').toPromise();
            await this.presentToast(msg, 'success');
            return user;
        } catch (err) {
            const msg = await this.translate.get('PROFILE.LANGUAGE_UPDATE_ERROR').toPromise();
            await this.presentToast(msg, 'danger');
            throw err;
        }
    }

    async getLanguages(): Promise<Language[]> {
        const url = `${this.config.config.apiBackendUrl}/utils/languages`;
        try {
            return await firstValueFrom(this.http.get<Language[]>(url));
        } catch (err) {
            console.error('Error obteniendo idiomas', err);
            return [];
        }
    }

    async guardarSerie(userId: string, serie: SeriesDetail): Promise<boolean> {
        const url = `${this.urlBackend}/${encodeURIComponent(userId)}/series/${serie.id}/toggle`;

        try {
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
            await this.presentToast('Error al guardar favorito', 'danger');
            throw err;
        }
    }

    async cargarSeriesFavoritas(uid: string): Promise<SeriesDetail[]> {
        const url = `${this.urlBackend}/${encodeURIComponent(uid)}/series`;
        try {
            const favs = await firstValueFrom(
                this.http.get<Array<{ id: number, name?: string }>>(url)
            );
            const favoritas: SeriesDetail[] = [];

            for (const f of favs) {
                try {
                    const detalle: SeriesDetail = await firstValueFrom(this.moviesService.getPeliculaDetalle(f.id));
                    if (detalle) {
                        favoritas.push(detalle);
                    }
                } catch (err) {
                    console.warn(`No se pudo obtener detalle para id=${f.id}`, err);
                    if (f.name) {
                        favoritas.push({
                            id: f.id,
                            name: f.name,
                        } as SeriesDetail);
                    }
                }
            }

            this.peliculas = favoritas;
            return favoritas;
        } catch (err) {
            console.error('Error cargando favoritos', err);
            await this.presentToast('Error al cargar favoritos', 'danger');
            return [];
        }
    }

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
