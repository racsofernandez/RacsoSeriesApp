import { Component, OnInit, Input } from '@angular/core';
import {ModalController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {Cast, Image, PeliculaDetalle, Persona, SeriesReview, UserList} from 'src/app/interfaces/interfaces';
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
import { ReviewsService } from '../../services/reviews.service';
import { ReviewModalComponent } from '../review-modal/review-modal.component';

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
  reviews: SeriesReview[] = [];
  userReview: SeriesReview | null = null;
  overviewExpanded = false;
  star = "star-outline";
  updated = false;
  loaded = false;
  userLists: UserList[] = [];
  private backButtonSub?: Subscription;
  userId: string | undefined;

  constructor(private moviesService: MoviesService,
              private modalCtrl: ModalController,
              private dataLocal: SeriesDbService,
              private auth: Auth,
              private platform: Platform,
              private translate: TranslateService,
              private userListService: UserListService,
              private popoverCtrl: PopoverController,
              private toastCtrl: ToastController,
              private reviewsService: ReviewsService
  ) { }

  ngOnInit() {
    this.userId = this.auth.currentUser?.uid;
    if (this.userId) {
        this.dataLocal.existeSerie(this.userId, this.id).then(existe => this.star = (existe) ? 'star': 'star-outline');
        this.loadUserLists(this.userId);
    }

    this.loadReviews();

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
            this.loaded = true;
        },
        error: (err) => {
            console.error(err);
            this.loaded = true;
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

  async loadReviews() {
    try {
      const reviews = await this.reviewsService.getReviewsForSeries(this.id).toPromise();
      this.reviews = reviews || [];
      if (this.userId) {
        this.userReview = this.reviews.find(r => r.user.id === this.userId) || null;
      }
    } catch (error) {
      console.error('Error loading reviews', error);
      this.reviews = [];
    }
  }

  regresar() {
      this.modalCtrl.dismiss({
          updated: this.updated
      }).then(r => false);
  }

  async favorito() {
    if (!this.userId) {
      console.error("No hay usuario autenticado");
      return;
    }
    const existeSerie = await this.dataLocal.guardarSerie(this.userId, this.pelicula);
    this.star = (existeSerie) ? 'star': 'star-outline';
    this.updated = true;
  }

    async abrirActor(persona: Persona) {
        const modal = await this.modalCtrl.create({
            component: ActorModalComponent,
            componentProps: { persona }
        });
        await modal.present();
    }

    async verTemporadas() {
        if (!this.pelicula.seasons) return;
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
            case 'backdrops': titleKey = 'DETAILS.BACKDROPS'; break;
            case 'posters': titleKey = 'DETAILS.POSTERS'; break;
            case 'logos': titleKey = 'DETAILS.LOGOS'; break;
            case 'single': titleKey = ''; break;
        }
        let title = titleKey ? await this.translate.get(titleKey).toPromise() : (this.pelicula.title || this.pelicula.name || '');
        const modal = await this.modalCtrl.create({
            component: ImageViewerModalComponent,
            componentProps: { images, startIndex: index, title }
        });
        await modal.present();
    }

    verImagenIndividual(path: string | undefined) {
        if (!path) return;
        const image: Image = { file_path: path, aspect_ratio: 0, height: 0, iso_639_1: null, vote_average: 0, vote_count: 0, width: 0 };
        this.verImagen([image], 0, 'single');
    }

    async openListsMenu(ev: any) {
        const popover = await this.popoverCtrl.create({
            component: ListsPopoverComponent,
            event: ev,
            translucent: true,
            componentProps: { lists: this.userLists },
            htmlAttributes: { 'style': '--width: 250px' }
        });
        await popover.present();
        const { data } = await popover.onWillDismiss();
        if (data) {
            if (data.action === 'create') this.createNewList();
            else if (data.action === 'add' && data.list) this.addToList(data.list);
        }
    }

    async createNewList() {
        const modal = await this.modalCtrl.create({
            component: UserListModalComponent,
            componentProps: { list: null }
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data?.updated && this.userId) {
            await this.loadUserLists(this.userId);
        }
    }

    async addToList(list: UserList) {
        if (!this.userId) return;
        try {
            await this.userListService.addSeriesToList(list.id, {
                name: this.pelicula.name || this.pelicula.title || '',
                user_id: this.userId,
                series_id: this.pelicula.id
            });
            this.presentToast('LISTS.ADDED_SUCCESS');
        } catch (error: any) {
            if (error.status === 409) this.presentToast('LISTS.ALREADY_IN_LIST');
            else this.presentToast('COMMON.ERROR');
        }
    }

    async openReviewModal() {
      if (!this.userId) {
        this.presentToast('COMMON.LOGIN_REQUIRED');
        return;
      }
      const modal = await this.modalCtrl.create({
        component: ReviewModalComponent,
        componentProps: {
          serie: this.pelicula,
          existingReview: this.userReview
        }
      });
      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data && data.action) {
        this.handleReviewModalDismiss(data);
      }
    }

    handleReviewModalDismiss(data: { action: string, review?: SeriesReview, reviewId?: number }) {
      if (!data.review && (data.action === 'create' || data.action === 'update')) {
        return;
      }

      switch (data.action) {
        case 'create':
          if (data.review) {
            this.reviews.unshift(data.review);
            this.userReview = data.review;
            this.presentToast('REVIEWS.CREATE_SUCCESS');
          }
          break;
        case 'update':
          if (data.review) {
            const index = this.reviews.findIndex(r => r.id === data.review!.id);
            if (index > -1) this.reviews[index] = data.review;
            this.userReview = data.review;
            this.presentToast('REVIEWS.UPDATE_SUCCESS');
          }
          break;
        case 'delete':
          this.reviews = this.reviews.filter(r => r.id !== data.reviewId);
          this.userReview = null;
          this.presentToast('REVIEWS.DELETE_SUCCESS');
          break;
      }
    }

    async presentToast(key: string) {
        const message = await this.translate.get(key).toPromise();
        const toast = await this.toastCtrl.create({ message, duration: 2000 });
        await toast.present();
    }

    ngOnDestroy() {
        this.backButtonSub?.unsubscribe();
    }
}
