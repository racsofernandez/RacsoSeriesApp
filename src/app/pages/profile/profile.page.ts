import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from "../../services/config.service";
import { Router } from "@angular/router";
import { User } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { SeriesDbService } from "../../services/series-db.service";
import { AppUser, Language } from "../../interfaces/interfaces";
import { MoviesService } from "../../services/movies.service";
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { RecommendationsModalComponent } from '../../components/recommendations-modal/recommendations-modal.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    user$: Observable<User | null>;
    appVersion = '';
    appUser: AppUser | null = null;
    languages: Language[] = [];
    selectedLanguageId: number | null = null;

    constructor(
        private authService: AuthService,
        private config: ConfigService,
        private router: Router,
        private seriesDbService: SeriesDbService,
        private cdr: ChangeDetectorRef,
        private moviesService: MoviesService,
        private translate: TranslateService,
        private modalCtrl: ModalController
    ) {
        this.user$ = this.authService.user$;
        this.appVersion = config.config.version;
    }

    async ngOnInit() {
        // Cargar idiomas disponibles
        try {
            this.languages = await this.seriesDbService.getLanguages();
        } catch (e) {
            console.error('Error cargando idiomas', e);
        }

        // Suscribirse al usuario de Firebase para obtener el ID y cargar el AppUser
        this.user$.subscribe(async (user) => {
            if (user) {
                try {
                    // Intentar obtener el usuario del backend
                    // Si ya lo tenemos en el servicio (cacheado) y coincide el ID, lo usamos
                    if (this.seriesDbService.appUser && this.seriesDbService.appUser.id === user.uid) {
                        this.appUser = this.seriesDbService.appUser;
                    } else {
                        this.appUser = await this.seriesDbService.getUsuario(user.uid);
                    }
                    
                    if (this.appUser && this.appUser.language) {
                        this.selectedLanguageId = this.appUser.language.id;
                        this.translate.use(this.appUser.language.code);
                        // Forzar detección de cambios para asegurar que la UI se actualice
                        this.cdr.detectChanges();
                    }
                } catch (error) {
                    console.error('Error cargando datos del usuario', error);
                }
            }
        });
    }

    async onLanguageChange(event: any) {
        const newLanguageId = event.detail.value;
        // Evitar actualizaciones innecesarias si el valor es el mismo o nulo
        if (this.appUser && newLanguageId && newLanguageId !== this.appUser.language.id) {
            try {
                const updatedUser = await this.seriesDbService.updateLanguage(this.appUser.id, newLanguageId);
                this.appUser = updatedUser;
                this.selectedLanguageId = updatedUser.language.id;
                
                // Actualizar el idioma en MoviesService para futuras peticiones
                if (updatedUser.language) {
                    this.moviesService.setLanguage(updatedUser.language.code);
                    this.translate.use(updatedUser.language.code);
                }

                this.cdr.detectChanges();
            } catch (error) {
                // Revertir cambio visualmente si falla
                console.error('Error al cambiar idioma', error);
                this.selectedLanguageId = this.appUser.language.id;
                this.cdr.detectChanges();
            }
        }
    }

    async openRecommendations() {
        const modal = await this.modalCtrl.create({
            component: RecommendationsModalComponent
        });
        await modal.present();
    }

    logout() {
        this.authService.logout();
    }

    goVerification() {
        this.router.navigate(['/verify-email']);
    }

}
