import { Component, OnInit, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth';
import { ProductService } from '../../core/service/product';
import { register } from 'swiper/element/bundle';
import { LucideDynamicIcon, LucideShoppingBag } from '@lucide/angular';

register();

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule,LucideDynamicIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
   readonly shoppingBag = LucideShoppingBag; 
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private router = inject(Router);

  newArrivals = signal<any[]>([]);
  bestSellers = signal<any[]>([]);
  clothesCollection = signal<any[]>([]);
  cartCount = signal<number>(0);

  ngOnInit(): void {
    this.loadCategorizedCatalog();
  }

  loadCategorizedCatalog(): void {
    // 1. Fetch New Arrivals Row
    this.productService.getProducts('new arrivals').subscribe({
      next: (data) => {
        this.newArrivals.set(data);
        this.triggerSwiperUpdate();
      },
      error: (err) => console.error('Failed fetching new arrivals:', err),
    });

    // 2. Fetch Best Sellers Row
    this.productService.getProducts('best sellers').subscribe({
      next: (data) => {
        this.bestSellers.set(data);
        this.triggerSwiperUpdate();
      },
      error: (err) => console.error('Failed fetching best sellers:', err),
    });

    // 3. Fetch Clothes Row (Leveraging our new fallback logic smoothly)
    this.productService.getProducts('clothes').subscribe({
      next: (data) => {
        this.clothesCollection.set(data);
        this.triggerSwiperUpdate();
      },
      error: (err) => console.error('Failed fetching clothes archive:', err),
    });
  }

  // Forces custom Web Component Swiper nodes to recalculate parameters upon rendering data arrays
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
