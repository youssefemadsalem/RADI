import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/service/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Layout View Toggles
  isLoginMode = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // Form Field Bindings
  email = '';
  password = '';

  toggleMode() {
    this.isLoginMode.update((val) => !val);
    this.errorMessage.set(null);
  }

  onSubmit() {
    this.errorMessage.set(null);
    const payload = { email: this.email, password: this.password };

    if (this.isLoginMode()) {
      // Execute Login Process
      this.authService.login(payload).subscribe({
        next: (res) => {
          if (res.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/shop']);
          }
        },
        error: (err) => this.errorMessage.set(err.error?.message || 'Login credentials rejected.'),
      });
    } else {
      // Execute Registration Process
      this.authService.register(payload).subscribe({
        next: () => {
          this.isLoginMode.set(true); // Flip cleanly to sign in screen
          alert('Registration successful! Please login.');
        },
        error: (err) =>
          this.errorMessage.set(err.error?.message || 'Registration structural block error.'),
      });
    }
  }
}
