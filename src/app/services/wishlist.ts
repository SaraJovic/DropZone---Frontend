import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wishlist } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private apiUrl = 'http://localhost:8081/api/wishlist';

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<Wishlist> {
    return this.http.get<Wishlist>(this.apiUrl);
  }

  addItemToWishlist(productId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/items/${productId}`, {});
  }

  removeItemFromWishlist(wishlistItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${wishlistItemId}`);
  }
}