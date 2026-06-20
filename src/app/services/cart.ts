import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, of, switchMap } from 'rxjs';
import { Cart, AddToCartRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8081/api/cart';
  private readonly cartCountSubject = new BehaviorSubject<number>(0);
  readonly cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCartCount(): number {
    return this.cartCountSubject.getValue();
  }

  resetCartCount(): void {
    this.cartCountSubject.next(0);
  }

  refreshCartCount(): Observable<number> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap((cart) => this.updateCountFromCart(cart)),
      map((cart) => this.countItems(cart)),
      catchError(() => {
        this.resetCartCount();
        return of(0);
      })
    );
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap((cart) => this.updateCountFromCart(cart))
    );
  }

  addItemToCart(data: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, data).pipe(
      tap((cart) => this.updateCountFromCart(cart))
    );
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${cartItemId}?quantity=${quantity}`, {}).pipe(
      tap((cart) => this.updateCountFromCart(cart))
    );
  }

  removeItemFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${cartItemId}`).pipe(
      switchMap(() => this.getCart()),
      map(() => void 0)
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`).pipe(
      tap(() => this.resetCartCount()),
      map(() => void 0)
    );
  }

  private updateCountFromCart(cart: Cart): void {
    this.cartCountSubject.next(this.countItems(cart));
  }

  private countItems(cart: Cart): number {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
