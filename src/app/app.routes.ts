import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  // Default path landing fallback points directly to your login portal
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },

  // Minimal Stark Authentication Portal
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth').then((m) => m.Auth),
  },

  // Public Marketplace E-Commerce Storefront Catalogue
  {
    path: 'shop',
    loadComponent: () => import('./components/shop/shop').then((m) => m.Shop),
  },

  // Premium Isolated Management Dashboard (Protected by our imported Functional Guard)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/admin').then((m) => m.Admin),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./components/admin/overview/overview').then((m) => m.Overview),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/admin/orders/orders').then((m) => m.Orders),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./components/admin/inventory/inventory').then(
            (m) => m.Inventory,
          ),
      },
    ],
  },

  // Catch-all wild card fallback points to auth to handle errors or unmatched paths
  {
    path: '**',
    redirectTo: 'auth',
  },
];