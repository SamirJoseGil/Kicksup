import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./admin-products.component').then(m => m.AdminProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./admin-orders.component').then(m => m.AdminOrdersComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent)
      }
    ]
  }
];
