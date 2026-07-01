import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard'; // 🌟 IMPORTED: Fresh Client-side Phase Lock Guard

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shop',
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
    canActivate: [authGuard], // 🌟 FIXED: Secures your entire user-facing layout tree from structural leaks
    loadComponent: () =>
      import('./components/layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'shop',
        loadComponent: () => import('./components/shop/shop').then((m) => m.Shop),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./components/product-details/product-details').then((m) => m.ProductDetails),
      },
      {
        path: 'checkout',
        loadComponent: () => import('./components/checkout/checkout').then((m) => m.Checkout),
      },
      {
        path: 'order-complete',
        loadComponent: () =>
          import('./components/order-complete/order-complete').then((m) => m.OrderComplete),
      },
      {
        path: '404',
        loadComponent: () => import('./components/not-found/not-found').then((m) => m.NotFound),
      },
    ],
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
        loadComponent: () =>
          import('./components/admin/inventory/inventory').then((m) => m.Inventory),
      },

      {
        path: 'inventory/add-product',
        loadComponent: () =>
          import('./components/admin/add-product/add-product').then((m) => m.AddProduct),
      },
  
      // i added this route to pass the product id in the url so the edit component knows what to fetch
      {
        path: 'inventory/edit-product/:id',
        loadComponent: () =>
          import('./components/admin/edit-product/edit-product').then((m) => m.EditProduct),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];
