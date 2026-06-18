import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, AddToCartRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8081/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addItemToCart(data: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, data);
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${cartItemId}?quantity=${quantity}`, {});
  }

  removeItemFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${cartItemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`);
  }
}