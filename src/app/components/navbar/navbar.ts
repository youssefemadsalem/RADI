import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon, LucideShoppingBag } from '@lucide/angular';

import { Cart } from '../../core/service/cart'; 
import { AuthService } from '../../core/service/auth'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './navbar.html',
})
export class Navbar {
  public cart = inject(Cart);
  public authService = inject(AuthService);
  private router = inject(Router);

  readonly shoppingBag = LucideShoppingBag;

  // Dynamic toast banner controller state
  logoutToastMessage = signal<string | null>(null);

  public totalItemsCount = computed(() => this.cart.cartCount());

  handleUserLogout(): void {
    if (this.logoutToastMessage()) return;

    // 1. Trigger the visual toast banner feedback
    this.logoutToastMessage.set('logging you out...');

    // 2. Shut down open drawers to avoid viewport overlap bugs
    this.cart.closeCart();

    // 3. Clear auth state tokens safely
    this.authService.logout();

    // 4. Smooth execution window delay before path switch
    setTimeout(() => {
      this.logoutToastMessage.set(null);
      this.router.navigate(['/auth']);
    }, 1000);
  }
}