import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/service/product'; 
import { Cart, CartItem } from '../../core/service/cart'; // 🌟 ADDED: Import Cart service and its interface

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(Cart); // 🌟 ADDED: Inject your Cart service instance

  // Architecture Signals for tracking view layout states
  public product = signal<any | null>(null);
  public selectedColor = signal<string>('');
  public selectedSize = signal<string>('');
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProductDetails(id);
      }
    });
  }

  private fetchProductDetails(id: string): void {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        if (data.colors?.length) this.selectedColor.set(data.colors[0]);
        if (data.sizes?.length) this.selectedSize.set(data.sizes[0]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[Product Details Error] Loading cycle tracking failed:', err);
        this.isLoading.set(false);
      }
    });
  }

  // 🌟 ADDED: Add item to cart pipeline execution
  public onAddToBag(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    // Construct the structured payload matching your CartItem schema
    const itemToAdd: CartItem = {
      _id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images?.[0] || 'assets/placeholder.jpg', // Passes the first base64 thumbnail string safely
      quantity: 1, // Default adding step increment to 1
      selectedSize: this.selectedSize() || 'OS',
      selectedColor: this.selectedColor() || currentProduct.colors?.[0] || 'Default'
    };

    // Push into the service signal system
    this.cartService.addItem(itemToAdd);

    // Optional: Open up the cart panel side-drawer layout instantly to confirm success
    this.cartService.openCart();
  }
}