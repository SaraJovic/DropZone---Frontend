import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { Cart } from '../../models';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

  cart: Cart | null = null;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
      },
      error: () => {
        this.cart = { id: 0, items: [], totalPrice: 0 };
        this.cartService.resetCartCount();
      }
    });
  }

  removeItem(cartItemId: number): void {
    this.cartService.removeItemFromCart(cartItemId).subscribe({
      next: () => this.loadCart()
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => this.loadCart()
    });
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
