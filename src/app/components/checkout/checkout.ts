import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { Cart } from '../../models';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {

  cart: Cart | null = null;
  shippingAddress = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
      },
      error: () => {
        this.cart = { id: 0, items: [], totalPrice: 0 };
      }
    });
  }

  placeOrder(): void {
    if (!this.shippingAddress.trim()) {
      this.errorMessage = 'Please enter a shipping address';
      return;
    }

    this.isLoading = true;
    this.orderService.createOrder({
      shippingAddress: this.shippingAddress
    }).subscribe({
      next: () => {
        this.successMessage = 'Order placed successfully!';
        this.errorMessage = '';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to place order';
        this.isLoading = false;
      }
    });
  }
}