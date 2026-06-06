import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth').then((m) => m.Auth),
  },
  {
    path: 'shop',
    loadComponent: () => import('./components/shop/shop').then((m) => m.Shop),
  },
  // ✅ ADDED: Checkout Route Dynamic Registration
  {
    path: 'checkout',
    loadComponent: () => import('./components/checkout/checkout').then((m) => m.Checkout),
  },
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
  {
    path: '**',
    redirectTo: 'auth',
  },
];