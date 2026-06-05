import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart } from '../../core/service/cart';
import { LucideDynamicIcon, LucideX, LucidePlus, LucideMinus } from '@lucide/angular'; // ✅

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon], // ✅
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css',
})
export class CartDrawer {
  public cartService = inject(Cart);

  readonly X = LucideX;
  readonly Plus = LucidePlus;   // ✅ LucidePlus not plus
  readonly Minus = LucideMinus;
}