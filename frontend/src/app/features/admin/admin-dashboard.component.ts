import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { Product, Order } from '../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./admin-dashboard.component.scss'],
  template: `
    <div class="dashboard-container">
      <h1>Panel de Administración</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.25 2.25a.75.75 0 000 1.5H3v16.5h-.75a.75.75 0 000 1.5H21v-1.5h-.75V3.75h.75a.75.75 0 000-1.5H2.25zM6.75 19.5v-5.25a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v5.25h-10.5zM7.5 6.75A.75.75 0 018.25 6h7.5a.75.75 0 01.75.75v5.25a.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V6.75z"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ totalProducts() }}</h3>
            <p>Total Productos</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ totalOrders() }}</h3>
            <p>Total Pedidos</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ pendingOrders() }}</h3>
            <p>Pedidos Pendientes</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ deliveredOrders() }}</h3>
            <p>Pedidos Entregados</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <a routerLink="/admin/products" class="action-card">
            <span class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.25 2.25a.75.75 0 000 1.5H3v16.5h-.75a.75.75 0 000 1.5H21v-1.5h-.75V3.75h.75a.75.75 0 000-1.5H2.25zM6.75 19.5v-5.25a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v5.25h-10.5zM7.5 6.75A.75.75 0 018.25 6h7.5a.75.75 0 01.75.75v5.25a.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V6.75z"/>
              </svg>
            </span>
            <h3>Gestionar Productos</h3>
            <p>Crear, editar y eliminar productos</p>
          </a>

          <a routerLink="/admin/orders" class="action-card">
            <span class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z"/>
              </svg>
            </span>
            <h3>Gestionar Pedidos</h3>
            <p>Ver y actualizar estados de pedidos</p>
          </a>
        </div>
      </div>

      @if (lowStockProducts().length > 0) {
        <div class="alerts-section">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 28px; height: 28px; vertical-align: middle; margin-right: 8px;">
              <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>
            </svg>
            Alertas de Stock Bajo
          </h2>
          <div class="alert-list">
            @for (product of lowStockProducts(); track product.id) {
              <div class="alert-item">
                <div class="alert-content">
                  <h4>{{ product.name }}</h4>
                  <p>Stock actual: <strong>{{ product.stock }} unidades</strong></p>
                </div>
                <a [routerLink]="['/admin/products', product.id]" class="btn-view">Ver</a>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);

  protected readonly totalProducts = signal(0);
  protected readonly totalOrders = signal(0);
  protected readonly pendingOrders = signal(0);
  protected readonly deliveredOrders = signal(0);
  protected readonly lowStockProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    // Load products
    this.productService.getAll().subscribe({
      next: (products) => {
        this.totalProducts.set(products.length);
        this.lowStockProducts.set(products.filter(p => p.stock <= 5));
      }
    });

    // Load orders
    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.totalOrders.set(orders.length);
        this.pendingOrders.set(orders.filter(o => o.status === 1).length);
        this.deliveredOrders.set(orders.filter(o => o.status === 4).length);
      }
    });
  }
}
