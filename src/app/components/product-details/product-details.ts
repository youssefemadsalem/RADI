import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/service/product'; 
import { Cart, CartItem } from '../../core/service/cart'; 

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
  private cartService = inject(Cart); 

  public product = signal<any | null>(null);
  public selectedColor = signal<string>('');
  public selectedSize = signal<string>('');
  public isLoading = signal<boolean>(true);
  
  // adding a new signal to hold the 3 recommended products
  public recommendedProducts = signal<any[]>([]);

  ngOnInit(): void {
    // this keeps listening for route changes so if they click a recommendation, the page updates automatically
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProductDetails(id);
        this.fetchRecommendations(id);
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
        // scrolling to top smoothly when a new product loads
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[Product Details Error] Loading cycle tracking failed:', err);
        this.isLoading.set(false);
      }
    });
  }

  // fetching all products and slicing out 3 for the bottom section
  private fetchRecommendations(currentProductId: string): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        // filtering out the active product so it doesnt show up in its own recommendations
        const filtered = data.filter(p => p._id !== currentProductId).slice(0, 4);
        this.recommendedProducts.set(filtered);
      },
      error: (err) => console.error('failed fetching recommendations', err)
    });
  }

  public onAddToBag(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const itemToAdd: CartItem = {
      _id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images?.[0] || 'assets/placeholder.jpg', 
      quantity: 1, 
      selectedSize: this.selectedSize() || 'OS',
      selectedColor: this.selectedColor() || currentProduct.colors?.[0] || 'Default'
    };

    this.cartService.addItem(itemToAdd);
    this.cartService.openCart();
  }
}