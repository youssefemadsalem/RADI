import { Component, OnInit, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth';
import { ProductService } from '../../core/service/product';
import { register } from 'swiper/element/bundle';
import { LucideDynamicIcon, LucideShoppingBag } from '@lucide/angular';
// 1. Import your Cart service and the CartDrawer component
import { Cart } from '../../core/service/cart'; 
import { CartDrawer } from '../cart-drawer/cart-drawer'; // Adjust this path to your folder setup

register();

@Component({
  selector: 'app-shop',
  standalone: true,
  // 2. Add CartDrawer to your template imports
  imports: [CommonModule, LucideDynamicIcon, CartDrawer], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  readonly shoppingBag = LucideShoppingBag; 
  
  // 3. Inject the Cart service publicly
  public cartService = inject(Cart);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private router = inject(Router);

  newArrivals = signal<any[]>([]);
  bestSellers = signal<any[]>([]);
  clothesCollection = signal<any[]>([]);
  
  // 4. Link cartCount directly to your service's computed signal value
  cartCount = this.cartService.cartCount;

  ngOnInit(): void {
    this.loadCategorizedCatalog();
  }

  loadCategorizedCatalog(): void {
    this.productService.getProducts('new arrivals').subscribe({
      next: (data) => { this.newArrivals.set(data); this.triggerSwiperUpdate(); },
      error: (err) => console.error('Failed fetching new arrivals:', err),
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

  private triggerSwiperUpdate(): void {
    setTimeout(() => {
      const swiperContainers = document.querySelectorAll('swiper-container');
      swiperContainers.forEach((swiper: any) => {
        if (swiper && swiper.initialize) {
          swiper.initialize();
        } else if (swiper && swiper.swiper) {
          swiper.swiper.update();
        }
      });
    }, 100);
  }

  handleUserLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}