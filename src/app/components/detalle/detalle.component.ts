import { Component, OnInit, Input } from '@angular/core';
import {ModalController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {Cast, Image, PeliculaDetalle, Persona, UserList} from 'src/app/interfaces/interfaces';
import { MoviesService } from 'src/app/services/movies.service';
import {SeriesDbService} from "../../services/series-db.service";
import {Auth} from "@angular/fire/auth";
import {ActorModalComponent} from "../actor-modal/actor-modal.component";
import {combineLatest, Subscription} from "rxjs";
import { SeasonsModalComponent } from '../seasons-modal/seasons-modal.component';
import { ImageViewerModalComponent } from '../image-viewer-modal/image-viewer-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { UserListService } from '../../services/user-list.service';
import { UserListModalComponent } from '../user-list-modal/user-list-modal.component';
import { ListsPopoverComponent } from '../lists-popover/lists-popover.component';

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
  loaded = false;
  userLists: UserList[] = [];
  private backButtonSub?: Subscription;

  constructor(private moviesService: MoviesService,
              private modalCtrl: ModalController,
              private dataLocal: SeriesDbService,
              private auth: Auth,
              private platform: Platform,
              private translate: TranslateService,
              private userListService: UserListService,
              private popoverCtrl: PopoverController,
              private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    console.log("id", this.id);

      const uid = this.auth.currentUser?.uid;
    if (uid!=null) {
        this.dataLocal.existeSerie(uid, this.id).then(existe => this.star = (existe) ? 'star': 'star-outline');
        this.loadUserLists(uid);
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

  async loadUserLists(userId: string) {
      try {
          this.userLists = await this.userListService.getUserLists(userId);
      } catch (e) {
          console.error('Error loading user lists', e);
      }
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

    async openListsMenu(ev: any) {
        const popover = await this.popoverCtrl.create({
            component: ListsPopoverComponent,
            event: ev,
            translucent: true,
            componentProps: {
                lists: this.userLists
            },
            htmlAttributes: {
                'style': '--width: 250px'
            }
        });

        await popover.present();

        const { data } = await popover.onWillDismiss();
        
        if (data) {
            if (data.action === 'create') {
                this.createNewList();
            } else if (data.action === 'add' && data.list) {
                this.addToList(data.list);
            }
        }
    }

    async createNewList() {
        const modal = await this.modalCtrl.create({
            component: UserListModalComponent,
            componentProps: { list: null }
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data?.updated && this.auth.currentUser) {
            await this.loadUserLists(this.auth.currentUser.uid);
            // Opcional: Añadir automáticamente a la nueva lista si pudiéramos obtener su ID
        }
    }

    async addToList(list: UserList) {
        if (!this.auth.currentUser) return;
        try {
            await this.userListService.addSeriesToList(list.id, {
                name: this.pelicula.name || this.pelicula.title || '',
                user_id: this.auth.currentUser.uid,
                series_id: this.pelicula.id
            });
            this.presentToast('LISTS.ADDED_SUCCESS');
        } catch (error: any) {
            if (error.status === 409) {
                this.presentToast('LISTS.ALREADY_IN_LIST');
            } else {
                this.presentToast('COMMON.ERROR');
            }
        }
    }

    async presentToast(key: string) {
        const message = await this.translate.get(key).toPromise();
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000
        });
        await toast.present();
    }

    ngOnDestroy() {
        this.backButtonSub?.unsubscribe();
    }

}
