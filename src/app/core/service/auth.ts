import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
// 🌟 ADDED: Import Router from the Angular router module
import { Router } from '@angular/router'; 
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router); 
  private apiUrl = 'http://localhost:5000/api/auth';

  currentUser = signal<{ email: string; role: string } | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('radi_token');
      const savedRole = localStorage.getItem('radi_role');
      const savedEmail = localStorage.getItem('radi_email');
      if (savedToken && savedRole && savedEmail) {
        this.currentUser.set({ email: savedEmail, role: savedRole });
        this.isAuthenticated.set(true);
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('radi_token', response.token);
          localStorage.setItem('radi_role', response.user.role);
          localStorage.setItem('radi_email', response.user.email);
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        }
      }),
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, payload);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Flush local authentication cache storage keys
      localStorage.clear();
      
      // 2. Reset reactive application state signals back to defaults
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      
      // 🌟 3. FIXED: Kick the user back to the auth page instantly
      this.router.navigate(['/auth']);
    }
  }
}