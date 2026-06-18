import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { User } from '../../models';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  cartItemCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loadCartCount();
    }
  }

  loadCartCount(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      },
      error: () => {}
    });
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
    this.authService.logout();
    this.router.navigate(['/']);
  }
}