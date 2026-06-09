import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router'; 
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    // Sync storage state instantly if running in the active user browser session
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('radi_token');
      const savedRole = localStorage.getItem('radi_role');
      const savedEmail = localStorage.getItem('radi_email');
      
      if (savedToken && savedRole && savedEmail) {
        this.currentUser.set({ email: savedEmail, role: savedRole });
        this.isAuthenticated.set(true);
      } else {
        // Explicitly force defaults if cache indexes are completely empty
        this.isAuthenticated.set(false);
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
    // 1. Reset signals globally so components react immediately across both platforms
    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    if (isPlatformBrowser(this.platformId)) {
      // 2. Flush browser identity cache local data references
      localStorage.removeItem('radi_token');
      localStorage.removeItem('radi_role');
      localStorage.removeItem('radi_email');
      
      // 3. Kick user out to auth route canvas
      this.router.navigate(['/auth']);
    }
  }
}