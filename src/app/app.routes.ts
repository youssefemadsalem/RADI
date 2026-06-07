import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shop', // Redirect straight to shop now that layouts wrapper handles structural targets
    pathMatch: 'full',
  },
  
  // 🚪 1. STANDALONE UNPROTECTED AUTH ROUTE (No Navbar, No Footer)
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth').then((m) => m.Auth),
  },

  // 🛍️ 2. PROTECTED MULTI-PAGE STORE ARCHITECTURE WRAPPER (With Navbar and Footer)
  {
    path: '',
    loadComponent: () => import('./components/layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'shop',
        loadComponent: () => import('./components/shop/shop').then((m) => m.Shop),
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./components/product-details/product-details').then((m) => m.ProductDetails),
      },
      {
        path: 'checkout',
        loadComponent: () => import('./components/checkout/checkout').then((m) => m.Checkout),
      },
      {
        path: 'order-complete',
        loadComponent: () => import('./components/order-complete/order-complete').then((m) => m.OrderComplete),
      },
      {
        path: '404',
        loadComponent: () => import('./components/not-found/not-found').then((m) => m.NotFound),
      }
    ]
  },

  // ⚙️ 3. STANDALONE ADMINISTRATIVE BACKOFFICE PANEL ARCHITECTURE
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/admin').then((m) => m.Admin),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./components/admin/overview/overview').then((m) => m.Overview),
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/admin/orders/orders').then((m) => m.Orders),
      },
      {
        path: 'inventory',
        loadComponent: () => import('./components/admin/inventory/inventory').then((m) => m.Inventory),
      },
    ],
  },

  // Catch-all Wildcard fallback route loop
{
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  },
];