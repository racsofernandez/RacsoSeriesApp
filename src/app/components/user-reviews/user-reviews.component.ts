import { Component, Input, OnInit } from '@angular/core';
import { Review, SeriesDetail } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { ReviewsService } from '../../services/reviews.service';
import { Auth } from '@angular/fire/auth';
import { ReviewModalComponent } from '../review-modal/review-modal.component';
import { MoviesService } from '../../services/movies.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss'],
})
export class UserReviewsComponent implements OnInit {

  @Input() userId: string;
  reviews: Review[] = [];
  loading = true;

  constructor(
    private modalCtrl: ModalController,
    private reviewsService: ReviewsService,
    private auth: Auth,
    private moviesService: MoviesService
  ) { }

  ngOnInit() {
    if (!this.userId) {
      this.userId = this.auth.currentUser?.uid || '';
    }
    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    if (!this.userId) {
      this.loading = false;
      return;
    }

    this.reviewsService.getUserReviews(this.userId).pipe(
      switchMap(reviews => {
        if (reviews.length === 0) {
          return of([]);
        }
        
        // Crear un array de observables para obtener los detalles de cada serie
        const requests = reviews.map(review => 
          this.moviesService.getPeliculaDetalle(review.seriesId).pipe(
            map(details => {
              // Asignar los detalles a la review
              // Cast necesario porque SeriesDetail es más completo que Series, pero compatible
              review.serie = details as any; 
              return review;
            }),
            catchError(error => {
              console.error(`Error loading details for series ${review.seriesId}`, error);
              // Si falla, retornamos la review tal cual (sin serie populated)
              return of(review);
            })
          )
        );

        return forkJoin(requests);
      })
    ).subscribe({
      next: (reviewsWithDetails) => {
        this.reviews = reviewsWithDetails;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews', error);
        this.loading = false;
      }
    });
  }

  async onEdit(review: Review) {
    const modal = await this.modalCtrl.create({
      component: ReviewModalComponent,
      componentProps: {
        serie: review.serie,
        existingReview: review
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.action) {
      this.loadReviews(); // Refresh reviews after edit
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
