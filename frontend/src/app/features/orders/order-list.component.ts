import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, RouterLink, FormsModule],
  styleUrls: ['./order-list.component.scss'],
  template: `
    <div class="orders-container">
      <h2>Mis Pedidos</h2>

      <div class="filters">
        <select [(ngModel)]="selectedStatus" (ngModelChange)="onFilterChange()" class="filter-select">
          <option [ngValue]="null">Todos los estados</option>
          <option [ngValue]="1">Pendiente</option>
          <option [ngValue]="2">Confirmado</option>
          <option [ngValue]="3">Enviado</option>
          <option [ngValue]="4">Entregado</option>
          <option [ngValue]="5">Cancelado</option>
        </select>
      </div>

      @if (loading()) {
        <div class="loading">Cargando pedidos...</div>
      } @else if (orders().length === 0) {
        <div class="no-orders">
          <p>No tienes pedidos {{ selectedStatus !== null ? 'con este estado' : 'todavía' }}</p>
          <a routerLink="/products" class="btn-primary">Ir al Catálogo</a>
        </div>
      } @else {
        <div class="orders-list">
          @for (order of orders(); track order.id) {
            <div class="order-card">
              <div class="order-header">
                <div>
                  <h3>Pedido #{{ order.id.substring(0, 8) }}</h3>
                  <p class="order-date">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
                <span [class]="'status status-' + order.status" class="status-badge">
                  {{ getStatusText(order.status) }}
                </span>
              </div>

              <div class="order-body">
                <div class="order-items">
                  @for (item of order.items; track item.productId) {
                    <div class="order-item">
                      <span class="item-name">{{ item.productName }}</span>
                      <span class="item-quantity">x{{ item.quantity }}</span>
                      <span class="item-price">{{ item.price | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                    </div>
                  }
                </div>

                <div class="order-footer">
                  <div class="order-total">
                    <span>Total:</span>
                    <span class="total-amount">{{ order.totalAmount | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                  </div>
                  <a [routerLink]="['/orders', order.id]" class="btn-detail">Ver Detalle</a>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class OrderListComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(false);
  protected selectedStatus: OrderStatus | null = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  protected onFilterChange(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading.set(true);

    this.orderService.getAll(this.selectedStatus ?? undefined).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  protected getStatusText(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.Pending]: 'Pendiente',
      [OrderStatus.Confirmed]: 'Confirmado',
      [OrderStatus.Shipped]: 'Enviado',
      [OrderStatus.Delivered]: 'Entregado',
      [OrderStatus.Cancelled]: 'Cancelado'
    };
    return statusMap[status] || 'Desconocido';
  }
}
