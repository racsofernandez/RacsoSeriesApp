import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  SeriesReview,
  CreateSeriesReviewRequest,
  UpdateSeriesReviewRequest
} from '../interfaces/interfaces';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private baseUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    // La URL base de la config ya es 'http://host/api/v1', solo añadimos el recurso
    this.baseUrl = this.config.config.apiBackendUrl + '/reviews';
  }

  getReviewsForSeries(seriesId: number): Observable<SeriesReview[]> {
    return this.http.get<SeriesReview[]>(`${this.baseUrl}/series/${seriesId}`).pipe(
      catchError(() => of([])) // En caso de error (ej. 404), devolver un array vacío
    );
  }

  createReview(review: CreateSeriesReviewRequest): Observable<SeriesReview> {
    return this.http.post<SeriesReview>(this.baseUrl, review);
  }

  updateReview(reviewId: number, userId: string, review: UpdateSeriesReviewRequest): Observable<SeriesReview> {
    return this.http.put<SeriesReview>(`${this.baseUrl}/${reviewId}?user_id=${userId}`, review);
  }

  deleteReview(reviewId: number, userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${reviewId}?user_id=${userId}`);
  }
}
