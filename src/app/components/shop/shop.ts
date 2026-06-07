import { Component, OnInit, inject, signal, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth';
import { ProductService } from '../../core/service/product';
import { register } from 'swiper/element/bundle';
import { LucideShoppingBag } from '@lucide/angular';
import { Cart } from '../../core/service/cart'; 
import { CartDrawer } from '../cart-drawer/cart-drawer'; 
import { RouterLink } from '@angular/router';

register();

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, CartDrawer, RouterLink], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  readonly shoppingBag = LucideShoppingBag; 
  private platformId = inject(PLATFORM_ID);
  public cartService = inject(Cart);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private router = inject(Router);

  newArrivals = signal<any[]>([]);
  bestSellers = signal<any[]>([]);
  clothesCollection = signal<any[]>([]);
  
  // Controls shop skeletal spinners / full page loaders
  isLoading = signal<boolean>(false);
  
  cartCount = this.cartService.cartCount;

  ngOnInit(): void {
    this.loadCategorizedCatalog();
  }

  loadCategorizedCatalog(): void {
    this.isLoading.set(true); // Activate loading UI block

    // Using a counter or tracking the main streams to cleanly unset loading
    this.productService.getProducts('new arrivals').subscribe({
      next: (data) => { this.newArrivals.set(data); this.triggerSwiperUpdate(); },
      error: (err) => console.error('Failed fetching new arrivals:', err),
      complete: () => this.isLoading.set(false) // Toggle off when primary content renders
    });

    this.productService.getProducts('best sellers').subscribe({
      next: (data) => { this.bestSellers.set(data); this.triggerSwiperUpdate(); },
      error: (err) => console.error('Failed fetching best sellers:', err),
    });

    this.productService.getProducts('clothes').subscribe({
      next: (data) => { this.clothesCollection.set(data); this.triggerSwiperUpdate(); },
      error: (err) => console.error('Failed fetching clothes archive:', err),
    });
  }

  addToCart(product: any): void {
    const selectedColor = product.colors?.[0] || '#171717';
    const selectedSize = product.sizes?.[0] || 'OS';

    const itemToSubmit = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '', 
      selectedSize: selectedSize,
      selectedColor: selectedColor,
      quantity: 1
    };

    if (typeof this.cartService.addItem === 'function') {
      this.cartService.addItem(itemToSubmit);
    } else if (this.cartService.items && typeof this.cartService.items.update === 'function') {
      this.cartService.items.update(items => [...items, itemToSubmit]);
    }

    this.cartService.openCart();
  }

  private triggerSwiperUpdate(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const swiperContainers = document.querySelectorAll('swiper-container');
        swiperContainers.forEach((swiper: any) => {
          if (swiper) {
            swiper.classList.remove('ssr-loading');
            
            if (swiper.initialize) {
              swiper.initialize();
            } else if (swiper.swiper) {
              swiper.swiper.update();
            }
          }
        });
      }, 100);
    }
  }

  handleUserLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}