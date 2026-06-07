import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
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
  private router = inject(Router); 

  readonly X = LucideX;
  readonly Plus = LucidePlus;   
  readonly Minus = LucideMinus;

  // Track redirection processing layout state
  isProcessing = signal<boolean>(false);

  /**
   * Shuts down layout visibility state flags and triggers router navigation
   */
  navigateToCheckout(): void {
    if (this.cartService.items().length === 0 || this.isProcessing()) return;

    // Start loading transition block
    this.isProcessing.set(true);

    // Minimal delay to let user see feedback before navigation takes over
    setTimeout(() => {
      // 1. Close the overlay sidebar to optimize smooth rendering transitions
      this.cartService.closeCart();

      // 2. Direct application focus explicitly to checkout node layout context
      this.router.navigate(['/checkout']).then(() => {
        this.isProcessing.set(false); // Clean up track state flag upon layout load completion
      }).catch(() => {
        this.isProcessing.set(false);
      });
    }, 600);
  }
}