import { Injectable, signal, computed } from '@angular/core';



export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  
isOpen = signal<boolean>(false);
  isInitialized = signal<boolean>(false); // Tracks application loading states

  constructor() {
    // Once initialization tasks (like reading token/localstorage) are complete
    this.isInitialized.set(true);
  }


 
  
  // Cart Items Collection Data Stream
  items = signal<CartItem[]>([
    // Mock data matching your attached UI design layout reference for testing:
    { _id: '1', name: 'ARCHIVAL WOOL BLAZER', price: 850, quantity: 1, selectedSize: '48', selectedColor: 'BLACK', image: 'assets/mock-blazer.jpg' },
    { _id: '2', name: 'RAW DENIM TROUSER', price: 420, quantity: 1, selectedSize: '32', selectedColor: 'INDIGO', image: 'assets/mock-jeans.jpg' },
    { _id: '3', name: 'SILK RIBBON SHIRT', price: 310, quantity: 1, selectedSize: 'M', selectedColor: 'WHITE', image: 'assets/mock-shirt.jpg' }
  ]);

  // Derived Computed Matrix Parameters (Updates dynamically automatically)
  cartCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  openCart(): void {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden'; // Prevents background body scrolling
  }

  closeCart(): void {
    this.isOpen.set(false);
    document.body.style.overflow = ''; // Restores scrolling smoothly
  }

  updateQuantity(id: string, amount: number): void {
    this.items.update(currentItems => 
      currentItems.map(item => {
        if (item._id === id) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  }

  removeItem(id: string): void {
    this.items.update(currentItems => currentItems.filter(item => item._id !== id));
  }
}
