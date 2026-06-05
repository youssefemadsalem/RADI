import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth';

// Custom type structure definition for controlling active form views
type AuthViewState = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Layout Engine States Tracker
  currentView = signal<AuthViewState>('LOGIN');
  feedbackMessage = signal<{ text: string; isSuccess: boolean } | null>(null);

  // Form Fields State Models
  email = '';
  password = '';
  otpCode = '';
  newPassword = '';

  switchView(target: AuthViewState) {
    this.currentView.set(target);
    this.feedbackMessage.set(null);
  }

  triggerAuthAction() {
    this.feedbackMessage.set(null);

    switch (this.currentView()) {
      case 'LOGIN':
        this.authService.login({ email: this.email, password: this.password }).subscribe({
          next: (res) => {
            if (res.user.role === 'admin') this.router.navigate(['/admin']);
            else this.router.navigate(['/shop']);
          },
          error: (err) => this.setToast(err.error?.message || 'Access denied. Check inputs.'),
        });
        break;

      case 'REGISTER':
        this.authService.register({ email: this.email, password: this.password }).subscribe({
          next: () => {
            this.setToast('Profile generated cleanly! Access open.', true);
            this.switchView('LOGIN');
          },
          error: (err) => this.setToast(err.error?.message || 'Profile formation broken.'),
        });
        break;

      case 'FORGOT_PASSWORD':
        this.authService.forgotPassword(this.email).subscribe({
          next: (res) => {
            this.setToast(res.message || 'OTP transmitted to mail.', true);
            this.switchView('RESET_PASSWORD'); // Pass straight to verify field form step
          },
          error: (err) => this.setToast(err.error?.message || 'Request transmission failure.'),
        });
        break;

      case 'RESET_PASSWORD':
        const resetPayload = {
          email: this.email,
          otp: this.otpCode,
          newPassword: this.newPassword,
        };
        this.authService.resetPassword(resetPayload).subscribe({
          next: (res) => {
            this.setToast(res.message || 'Identity altered safely.', true);
            this.switchView('LOGIN');
            // Clean fields
            this.otpCode = '';
            this.newPassword = '';
          },
          error: (err) => this.setToast(err.error?.message || 'Security override failed.'),
        });
        break;
    }
  }

  private setToast(msg: string, success: boolean = false) {
    this.feedbackMessage.set({ text: msg, isSuccess: success });
  }
}
