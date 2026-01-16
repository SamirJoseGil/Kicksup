import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./order-list.component').then(m => m.OrderListComponent)
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () => import('./order-create.component').then(m => m.OrderCreateComponent)
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () => import('./order-detail.component').then(m => m.OrderDetailComponent)
  }
];
