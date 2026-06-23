import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { ReviewService } from '../../services/review';
import { Product, ProductVariant, Review } from '../../models';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {

  product: Product | null = null;
  isLoading = true;
  selectedVariant: ProductVariant | null = null;
  selectedImageIndex = 0;
  quantity = 1;
  successMessage = '';
  errorMessage = '';

  // Reviews
  reviews: Review[] = [];
  newRating = 0;
  newComment = '';
  reviewSuccessMessage = '';
  reviewErrorMessage = '';
  isSubmittingReview = false;

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastService: ToastService,
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe({
        next: (data) => {
          this.product = data;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });

      this.loadReviews(+id);
    }
  }

  loadReviews(productId: number): void {
    this.reviewService.getReviewsByProduct(productId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.reviews = [];
        this.cdr.markForCheck();
      }
    });
  }

  deleteReview(reviewId: number): void {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.cdr.markForCheck();
      },
      error: () => {
        // silently fail — admin-only action, unlikely to need UX messaging here
      }
    });
  }

  setRating(stars: number): void {
    this.newRating = stars;
    this.cdr.markForCheck();
  }

  submitReview(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.newRating === 0) {
      this.reviewErrorMessage = 'Please select a rating';
      this.reviewSuccessMessage = '';
      this.cdr.markForCheck();
      return;
    }

    if (!this.product) return;

    this.isSubmittingReview = true;
    this.reviewErrorMessage = '';

    this.reviewService.createReview(this.product.id, {
      rating: this.newRating,
      comment: this.newComment
    }).subscribe({
      next: () => {
        this.reviewSuccessMessage = 'Review submitted!';
        this.reviewErrorMessage = '';
        this.newRating = 0;
        this.newComment = '';
        this.isSubmittingReview = false;
        this.loadReviews(this.product!.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.reviewErrorMessage = err.error?.message || 'Failed to submit review';
        this.reviewSuccessMessage = '';
        this.isSubmittingReview = false;
        this.cdr.markForCheck();
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
    this.cdr.markForCheck();
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
        this.toastService.show('Added to your bag');
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
          this.toastService.show('Saved to wishlist');
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