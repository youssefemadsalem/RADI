import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon, LucideShoppingBag } from '@lucide/angular';

// 🌟 FIX 1: Import Cart directly (matching your class Cart export name)
import { Cart } from '../../core/service/cart'; 
import { AuthService } from '../../core/service/auth'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './navbar.html',
})
export class Navbar {
  // 🌟 FIX 2: Inject the correct Cart class reference token
  public cart = inject(Cart);
  public authService = inject(AuthService);

  readonly shoppingBag = LucideShoppingBag;

  // 🌟 FIX 3: Read from your existing cartCount computed signal built inside the service!
  public totalItemsCount = computed(() => this.cart.cartCount());

  handleUserLogout(): void {
    this.authService.logout();
  }
}