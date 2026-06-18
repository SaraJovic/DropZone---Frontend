import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
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
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.cartService.getCart(user.id).subscribe({
        next: (data) => {
          this.cart = data;
        },
        error: () => {
          this.cart = { id: 0, items: [], totalPrice: 0 };
        }
      });
    }
  }

  removeItem(cartItemId: number): void {
    this.cartService.removeItemFromCart(cartItemId).subscribe({
      next: () => {
        this.loadCart();
      }
    });
  }

  clearCart(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.cartService.clearCart(user.id).subscribe({
        next: () => {
          this.loadCart();
        }
      });
    }
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}