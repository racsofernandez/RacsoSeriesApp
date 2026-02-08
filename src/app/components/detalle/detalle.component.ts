import { Component, OnInit, Input } from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {Cast, Image, PeliculaDetalle, Persona} from 'src/app/interfaces/interfaces';
import { MoviesService } from 'src/app/services/movies.service';
import {SeriesDbService} from "../../services/series-db.service";
import {Auth} from "@angular/fire/auth";
import {ActorModalComponent} from "../actor-modal/actor-modal.component";
import {combineLatest, Subscription} from "rxjs";
import { SeasonsModalComponent } from '../seasons-modal/seasons-modal.component';
import { ImageViewerModalComponent } from '../image-viewer-modal/image-viewer-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent  implements OnInit {

  @Input() id: any;

  pelicula: PeliculaDetalle = {id:0};
  actores: Cast[] = [];
  backdrops: Image[] = [];
  posters: Image[] = [];
  logos: Image[] = [];
  overviewExpanded = false;
  star = "star-outline";
  updated = false;
  loaded = false; // 👈 Nueva variable
  private backButtonSub?: Subscription;

  constructor(private moviesService: MoviesService,
              private modalCtrl: ModalController,
              private dataLocal: SeriesDbService,
              private auth: Auth,
              private platform: Platform,
              private translate: TranslateService
  ) { }

  ngOnInit() {
    console.log("id", this.id);

      const uid = this.auth.currentUser?.uid;
    if (uid!=null) {
        this.dataLocal.existeSerie(uid, this.id).then(existe => this.star = (existe) ? 'star': 'star-outline');
    }

    // Usar combineLatest para saber cuando todo ha cargado
    combineLatest([
        this.moviesService.getPeliculaDetalle(this.id),
        this.moviesService.getActoresPelicula(this.id),
        this.moviesService.getSeriesImages(this.id)
    ]).subscribe({
        next: ([detalle, actores, imagenes]) => {
            this.pelicula = detalle;
            this.actores = actores.cast;
            this.backdrops = imagenes.backdrops;
            this.posters = imagenes.posters;
            this.logos = imagenes.logos;
            this.loaded = true; // 👈 Todo listo
        },
        error: (err) => {
            console.error(err);
            this.loaded = true; // Evitar bloqueo infinito
        }
    });
  }

  regresar() {
      this.modalCtrl.dismiss({
          updated: this.updated   // devolvemos un flag
      }).then(r => false);
  }

  async favorito() {
    const user = this.auth.currentUser;
    if (!user) {
      console.error("No hay usuario autenticado");
      return;
    }
    const uid = user.uid;   // <-- ESTE ES EL ID DEL USUARIO

    const existeSerie = await this.dataLocal.guardarSerie(uid, this.pelicula);
    this.star = (existeSerie) ? 'star': 'star-outline';
    this.updated = true;
  }

    async abrirActor(persona: Persona) {
        console.log(persona);
        const modal = await this.modalCtrl.create({
            component: ActorModalComponent,
            componentProps: {
                persona
            }
        });

        await modal.present();
    }

    async verTemporadas() {
        if (!this.pelicula.seasons) {
            return;
        }

        const modal = await this.modalCtrl.create({
            component: SeasonsModalComponent,
            componentProps: {
                seasons: this.pelicula.seasons,
                seriesTitle: this.pelicula.name || this.pelicula.title
            }
        });

        await modal.present();
    }

    async verImagen(images: Image[], index: number, type: string) {
        let titleKey = '';
        switch (type) {
            case 'backdrops':
                titleKey = 'DETAILS.BACKDROPS';
                break;
            case 'posters':
                titleKey = 'DETAILS.POSTERS';
                break;
            case 'logos':
                titleKey = 'DETAILS.LOGOS';
                break;
            case 'single':
                titleKey = ''; // No title for single image view from header/poster
                break;
        }

        let title = '';
        if (titleKey) {
            title = await this.translate.get(titleKey).toPromise();
        } else if (type === 'single') {
             // Optional: Use movie title or something else if needed
             title = this.pelicula.title || this.pelicula.name || '';
        }


        const modal = await this.modalCtrl.create({
            component: ImageViewerModalComponent,
            componentProps: {
                images: images,
                startIndex: index,
                title: title
            }
        });
        await modal.present();
    }

    verImagenIndividual(path: string | undefined) {
        if (!path) return;
        
        const image: Image = {
            file_path: path,
            aspect_ratio: 0,
            height: 0,
            iso_639_1: null,
            vote_average: 0,
            vote_count: 0,
            width: 0
        };
        
        this.verImagen([image], 0, 'single');
    }

    ngOnDestroy() {
        this.backButtonSub?.unsubscribe();
    }

}
