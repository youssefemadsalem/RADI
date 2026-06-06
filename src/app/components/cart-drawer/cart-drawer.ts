import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // ✅ Inject Angular Router Engine
import { Cart } from '../../core/service/cart';
import { LucideDynamicIcon, LucideX, LucidePlus, LucideMinus } from '@lucide/angular';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css',
})
export class CartDrawer {
  public cartService = inject(Cart);
  private router = inject(Router); // ✅ Injected Router Engine Instance

  readonly X = LucideX;
  readonly Plus = LucidePlus;   
  readonly Minus = LucideMinus;

  /**
   * Shuts down layout visibility state flags and triggers router navigation
   */
  navigateToCheckout(): void {
    if (this.cartService.items().length === 0) return;

    // 1. Close the overlay sidebar to optimize smooth rendering transitions
    this.cartService.closeCart();

    // 2. Direct application focus explicitly to checkout node layout context
    this.router.navigate(['/checkout']);
  }
}