import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  _id: string; // Product MongoDB ObjectID string
  name: string;
  price: number;
  image: string; // Base64 data string from database clusters
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  isOpen = signal<boolean>(false);
  isInitialized = signal<boolean>(false); // Tracks application loading states

  // Cart Items Collection Data Stream (Cleared mock items for live production database sync)
  items = signal<CartItem[]>([]);

  // Derived Computed Matrix Parameters (Updates automatically when signal state mutates)
  cartCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  constructor() {
    // Sync or initial token validations can be initialized here
    this.isInitialized.set(true);
  }

  openCart(): void {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden'; // Prevents background body scrolling
  }

  closeCart(): void {
    this.isOpen.set(false);
    document.body.style.overflow = ''; // Restores scrolling smoothly
  }

  /**
   * Appends or increments an item inside the basket.
   * Matches uniqueness on a combination of ID + Size + Color variation parameters.
   */
  addItem(newItem: CartItem): void {
    this.items.update((currentItems) => {
      // Find index checking if the exact configuration exists already
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item._id === newItem._id &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor
      );

      if (existingItemIndex > -1) {
        // Variation exists, map over to increment quantity safely
        return currentItems.map((item, idx) =>
          idx === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      // Fresh variant choice, append directly to collection stream
      return [...currentItems, newItem];
    });
  }

  /**
   * Adjusts quantity using variant compound keys to prevent matching multiple unique choices.
   */
  updateQuantity(id: string, amount: number, size?: string, color?: string): void {
    this.items.update((currentItems) =>
      currentItems.map((item) => {
        // Optional tracking fallback ensures absolute precision with color/size variants
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

  /**
   * Drops a specific variant from the signal storage map
   */
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