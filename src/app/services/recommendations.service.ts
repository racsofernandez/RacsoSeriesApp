import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { RecommendationResponse } from '../interfaces/interfaces';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class RecommendationsService {

    private urlBackend = '';

    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private translate: TranslateService
    ) {
        this.urlBackend = config.config.apiBackendUrl + "/users";
    }

    async getRecommendations(userId: string): Promise<RecommendationResponse> {
        const lang = this.translate.currentLang || 'es';
        const url = `${this.urlBackend}/${userId}/recommendations?language=${lang}`;
        try {
            return await firstValueFrom(this.http.get<RecommendationResponse>(url));
        } catch (err) {
            console.error('Error getting recommendations', err);
            throw err;
        }
    }
}
