import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, CreateReviewRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8081/api/reviews';

  constructor(private http: HttpClient) {}

  getReviewsByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`);
  }

  createReview(productId: number, data: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/product/${productId}`, data);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }
}