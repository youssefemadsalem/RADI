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

  // Core Presentation Signals
  public product = signal<any | null>(null);
  public isLoading = signal<boolean>(true);
  public recommendedProducts = signal<any[]>([]);

  // Creative Carousel State Node
  public currentImageIndex = signal<number>(0);

  ngOnInit(): void {
    // Listens to parameter route state streams to smoothly catch recommendation clicks
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
        this.currentImageIndex.set(0); // Safely reset carousel view pane to master index
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[Product Details Error] Loading cycle tracking failed:', err);
        this.isLoading.set(false);
      }
    });
  }

  private fetchRecommendations(currentProductId: string): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        // Exclude the active product item profile context from its own lookbook deck
        const filtered = data.filter(p => p._id !== currentProductId).slice(0, 4);
        this.recommendedProducts.set(filtered);
      },
      error: (err) => console.error('[Recommendations Error] Population sequence failed:', err)
    });
  }

  /**
   * Defensive Web Asset URL Matrix Normalizer
   * Strips local operating system absolute paths and maps them cleanly into relative assets.
   */
  public resolveImageUrl(imageStr: string): string {
    if (!imageStr) return '';
    if (imageStr.startsWith('http') || imageStr.startsWith('data:')) return imageStr;
    
    let cleanPath = imageStr;
    if (imageStr.includes('uploads/')) {
      cleanPath = 'uploads/' + imageStr.split('uploads/')[1];
    } else if (imageStr.includes('uploads\\')) {
      cleanPath = 'uploads/' + imageStr.split('uploads\\')[1];
    }
    
    cleanPath = cleanPath.replace(/\\/g, "/");
    return `http://localhost:5000/${cleanPath}`;
  }

  // Carousel Transformation Handlers
  public nextImage(totalLength: number, event: Event): void {
    event.stopPropagation();
    this.currentImageIndex.update(i => (i + 1) % totalLength);
  }

  public prevImage(totalLength: number, event: Event): void {
    event.stopPropagation();
    this.currentImageIndex.update(i => (i - 1 + totalLength) % totalLength);
  }

  // Checkout Core Dispatcher
  public onAddToBag(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const itemToAdd: CartItem = {
      _id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: this.resolveImageUrl(currentProduct.images?.[0] || ''), 
      quantity: 1, 
      selectedSize: 'OS',       // Uniform blueprint standard
      selectedColor: 'Default'  // Uniform blueprint standard
    };

    this.cartService.addItem(itemToAdd);
    this.cartService.openCart();
  }
}