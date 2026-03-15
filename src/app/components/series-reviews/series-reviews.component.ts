import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReviewsService } from '../../services/reviews.service';
import { SeriesReview } from '../../interfaces/interfaces';

@Component({
  selector: 'app-series-reviews',
  templateUrl: './series-reviews.component.html',
  styleUrls: ['./series-reviews.component.scss'],
})
export class SeriesReviewsComponent implements OnInit {

  @Input() seriesId: number;
  @Input() seriesTitle: string;
  reviews: SeriesReview[] = [];
  loading = true;

  constructor(
    private modalCtrl: ModalController,
    private reviewsService: ReviewsService
  ) { }

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    if (!this.seriesId) {
      this.loading = false;
      return;
    }
    this.reviewsService.getReviewsForSeries(this.seriesId).subscribe(reviews => {
      this.reviews = reviews;
      this.loading = false;
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
