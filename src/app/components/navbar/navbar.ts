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
  logoutToastMessage = signal<string | null>(null);
  public isMobileMenuOpen = signal<boolean>(false);

  public totalItemsCount = computed(() => this.cart.cartCount());

  public isMasterAdmin = computed(() => {
    const user = this.authService.currentUser();
    return user?.email === 'youssefemadeldin22@gmail.com';
  });

  handleUserLogout(): void {
    if (this.logoutToastMessage()) return;

    this.logoutToastMessage.set('logging you out...');
    this.cart.closeCart();
    this.authService.logout();

    setTimeout(() => {
      this.logoutToastMessage.set(null);
      this.router.navigate(['/auth']);
    }, 1000);
  }
}