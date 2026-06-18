import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { AuthService } from '../../services/auth';
import { Product, ProductVariant } from '../../models';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {

  product: Product | null = null;
  selectedVariant: ProductVariant | null = null;
  quantity = 1;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe({
        next: (data) => {
          this.product = data;
          this.cdr.markForCheck();
        }
      });
    }
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
    this.cdr.markForCheck();
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedVariant) {
      this.errorMessage = 'Please select a size and color';
      this.successMessage = '';
      this.cdr.markForCheck();
      return;
    }

    this.cartService.addItemToCart({
      productVariantId: this.selectedVariant.id,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.successMessage = 'Added to cart!';
        this.errorMessage = '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add to cart';
        this.successMessage = '';
        this.cdr.markForCheck();
      }
    });
  }

  addToWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      this.wishlistService.addItemToWishlist(this.product.id).subscribe({
        next: () => {
          this.successMessage = 'Added to wishlist!';
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to add to wishlist';
          this.successMessage = '';
          this.cdr.markForCheck();
        }
      });
    }
  }
}