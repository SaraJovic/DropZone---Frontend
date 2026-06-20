import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { User } from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  isScrolled = false;
  cartBump = false;

  private cartSub?: Subscription;
  private previousCartCount = 0;
  private cartInitialized = false;
  private bumpTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.cartCount$.subscribe((count) => {
      if (this.cartInitialized && count > this.previousCartCount) {
        this.triggerCartBump();
      }
      this.cartInitialized = true;
      this.previousCartCount = count;
      this.cartItemCount = count;
    });

    if (this.isLoggedIn()) {
      this.cartService.refreshCartCount().subscribe();
    }
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
    if (this.bumpTimeout) {
      clearTimeout(this.bumpTimeout);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 24;
  }

  triggerCartBump(): void {
    this.cartBump = true;
    if (this.bumpTimeout) {
      clearTimeout(this.bumpTimeout);
    }
    this.bumpTimeout = setTimeout(() => {
      this.cartBump = false;
    }, 550);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getCurrentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.cartService.resetCartCount();
    this.previousCartCount = 0;
    this.cartInitialized = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
