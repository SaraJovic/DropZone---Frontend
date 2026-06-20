import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { PaymentService } from '../../services/payment';
import { Cart, Order } from '../../models';
import { STRIPE_PUBLISHABLE_KEY } from '../../stripe.config';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit, AfterViewInit {

  @ViewChild('cardElement') cardElementRef!: ElementRef;

  cart: Cart | null = null;
  shippingAddress = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;
  isPaying = false;

  step: 'shipping' | 'payment' = 'shipping';
  createdOrder: Order | null = null;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  clientSecret: string | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (data) => { this.cart = data; },
      error: () => {
        this.cart = { id: 0, items: [], totalPrice: 0 };
        this.cartService.resetCartCount();
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    this.stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
  }

  placeOrder(): void {
    if (!this.shippingAddress.trim()) {
      this.errorMessage = 'Please enter a shipping address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.createOrder({
      shippingAddress: this.shippingAddress
    }).subscribe({
      next: (order) => {
        this.createdOrder = order;
        this.isLoading = false;
        this.step = 'payment';
        this.initializePaymentStep(order.id);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to place order';
        this.isLoading = false;
      }
    });
  }

  initializePaymentStep(orderId: number): void {
    this.paymentService.createPaymentIntent(orderId, 'usd').subscribe({
      next: (response) => {
        this.clientSecret = response.clientSecret;
        setTimeout(() => this.mountCardElement(), 0);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to initialize payment';
      }
    });
  }

  async mountCardElement(): Promise<void> {
    if (!this.stripe) return;

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#1a1a1a',
          '::placeholder': { color: '#999' }
        }
      }
    });
    this.cardElement.mount(this.cardElementRef.nativeElement);
  }

  async confirmPayment(): Promise<void> {
    if (!this.stripe || !this.cardElement || !this.clientSecret) return;

    this.isPaying = true;
    this.errorMessage = '';

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.cardElement
      }
    });

    if (result.error) {
      this.errorMessage = result.error.message || 'Payment failed';
      this.isPaying = false;
      return;
    }

    if (result.paymentIntent?.status === 'succeeded') {
      this.paymentService.confirmPaymentSuccess(this.createdOrder!.id).subscribe({
        next: () => {
          this.handlePaymentSuccess();
        },
        error: () => {
          this.handlePaymentSuccess();
        }
      });
    }
  }

  private handlePaymentSuccess(): void {
    this.cartService.resetCartCount();
    this.cart = { id: 0, items: [], totalPrice: 0 };
    this.successMessage = 'Payment successful! Redirecting to your orders...';
    this.isPaying = false;
    setTimeout(() => {
      this.router.navigate(['/orders']);
    }, 2000);
  }

  backToShipping(): void {
    this.step = 'shipping';
  }
}
