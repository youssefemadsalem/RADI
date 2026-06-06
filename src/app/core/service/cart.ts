import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  _id: string; 
  name: string;
  price: number;
  image: string; 
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private platformId = inject(PLATFORM_ID); 
  
  isOpen = signal<boolean>(false);
  isInitialized = signal<boolean>(false); 

  items = signal<CartItem[]>([]);

  cartCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  constructor() {
    this.isInitialized.set(true);
  }

  openCart(): void {
    this.isOpen.set(true);
    // ✅ Safely run window mutations only inside client browsers
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden'; 
    }
  }

  closeCart(): void {
    this.isOpen.set(false);
    // ✅ Safely release scroll tracks only inside client browsers
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = ''; 
    }
  }

  addItem(newItem: CartItem): void {
    this.items.update((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item._id === newItem._id &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor
      );

      if (existingItemIndex > -1) {
        return currentItems.map((item, idx) =>
          idx === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  }

  updateQuantity(id: string, amount: number, size?: string, color?: string): void {
    this.items.update((currentItems) =>
      currentItems.map((item) => {
        const matchesVariant =
          item._id === id &&
          (!size || item.selectedSize === size) &&
          (!color || item.selectedColor === color);

        if (matchesVariant) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  }

  removeItem(id: string, size?: string, color?: string): void {
    this.items.update((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item._id === id &&
            (!size || item.selectedSize === size) &&
            (!color || item.selectedColor === color)
          )
      )
    );
  }
}