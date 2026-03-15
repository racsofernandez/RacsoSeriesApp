import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewsService } from '../../services/reviews.service';
import { Auth } from '@angular/fire/auth';
import { Series, SeriesDetail, SeriesReview } from '../../interfaces/interfaces';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
})
export class ReviewModalComponent implements OnInit {

  @Input() serie: SeriesDetail | Series;
  @Input() existingReview: SeriesReview | null = null;

  reviewForm: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  rating = 0;
  hoverRating = 0;
  isEditMode = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private reviewsService: ReviewsService,
    private auth: Auth
  ) { }

  ngOnInit() {
    this.isEditMode = !!this.existingReview;
    this.rating = this.existingReview?.rating || 0;

    this.reviewForm = this.fb.group({
        comment: [this.existingReview?.comment || '', [Validators.required, Validators.minLength(10)]]
    });
  }

  closeModal(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  setHoverRating(rating: number) {
    this.hoverRating = rating;
  }

  get comment() {
    return this.reviewForm.get('comment');
  }

  async submitReview() {
    if (this.reviewForm.invalid || this.rating === 0) {
      return;
    }

    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      // Handle not logged in user
      return;
    }

    try {
      if (this.isEditMode && this.existingReview) {
        const updatedReview = await this.reviewsService.updateReview(
          this.existingReview.id,
          userId,
          { comment: this.reviewForm.value.comment, rating: this.rating }
        ).toPromise();
        this.closeModal({ action: 'update', review: updatedReview });
      } else {
        const newReview = await this.reviewsService.createReview({
          userId,
          seriesId: this.serie.id,
          comment: this.reviewForm.value.comment,
          rating: this.rating
        }).toPromise();
        this.closeModal({ action: 'create', review: newReview });
      }
    } catch (error) {
      console.error('Error submitting review', error);
      // Handle error (e.g., show a toast)
    }
  }

  async deleteReview() {
    if (!this.isEditMode || !this.existingReview) {
      return;
    }

    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      return;
    }

    try {
      await this.reviewsService.deleteReview(this.existingReview.id, userId).toPromise();
      this.closeModal({ action: 'delete', reviewId: this.existingReview.id });
    } catch (error) {
      console.error('Error deleting review', error);
      // Handle error
    }
  }
}
