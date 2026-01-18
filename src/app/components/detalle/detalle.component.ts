import { Component, OnInit, Input } from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {Cast, Image, PeliculaDetalle, Persona} from 'src/app/interfaces/interfaces';
import { MoviesService } from 'src/app/services/movies.service';
import {SeriesDbService} from "../../services/series-db.service";
import {Auth} from "@angular/fire/auth";
import {ActorModalComponent} from "../actor-modal/actor-modal.component";
import {Subscription} from "rxjs";
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

      // this.platform.backButton.subscribeWithPriority(10, async () => {
      //     const topModal = await this.modalCtrl.getTop();
      //     if (topModal) {
      //         await topModal.dismiss();
      //     }
      // });

      const uid = this.auth.currentUser?.uid;
    if (uid!=null) {
        this.dataLocal.existeSerie(uid, this.id).then(existe => this.star = (existe) ? 'star': 'star-outline');
    }

    this.moviesService.getPeliculaDetalle(this.id)
      .subscribe( resp => {
        this.pelicula = resp;
        console.log("detalle", resp);
        //  this.populares = resp.results;
      })

    this.moviesService.getActoresPelicula(this.id)
    .subscribe( resp => {
      this.actores = resp.cast;
      console.log("actores", this.actores);
      //  this.populares = resp.results;
    })

    this.moviesService.getSeriesImages(this.id)
        .subscribe( resp => {
            this.backdrops = resp.backdrops;
            this.posters = resp.posters;
            this.logos = resp.logos;
            console.log("images", resp);
        })
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
        }

        const title = await this.translate.get(titleKey).toPromise();

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

    ngOnDestroy() {
        this.backButtonSub?.unsubscribe();
    }

}
