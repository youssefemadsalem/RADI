import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // 🔥 UPDATE: Instead of returning false (which drops a 404), allow the shell 
  // to pass through to the browser so client-side Angular can redirect cleanly!
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // Active Browser Session Checking Strategy
  const token = localStorage.getItem('radi_token');
  if (token) {
    return true;
  }

  // No active credentials? Client safely bounces them to /auth instead of a crash
  router.navigate(['/auth']);
  return false;
};