import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist';
import { AuthService } from '../../services/auth';
import { Wishlist } from '../../models';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistComponent implements OnInit {

  wishlist: Wishlist | null = null;
  successMessage = '';

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.wishlistService.getWishlist(user.id).subscribe({
        next: (data) => {
          this.wishlist = data;
          this.cdr.markForCheck();
        },
        error: () => {
          this.wishlist = { id: 0, items: [] };
          this.cdr.markForCheck();
        }
      });
    }
  }

  removeItem(wishlistItemId: number): void {
    this.wishlistService.removeItemFromWishlist(wishlistItemId).subscribe({
      next: () => {
        this.successMessage = 'Item removed from wishlist!';
        this.loadWishlist();
        this.cdr.markForCheck();
      }
    });
  }
}