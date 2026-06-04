import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the user is fully logged in and holds 'admin' access tokens, grant entry
  if (authService.isAuthenticated() && authService.currentUser()?.role === 'admin') {
    return true;
  }

  // Otherwise, block entry and redirect cleanly back to the authentication panel node
  router.navigate(['/auth']);
  return false;
};
