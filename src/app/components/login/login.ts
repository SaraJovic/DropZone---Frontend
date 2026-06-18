import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}