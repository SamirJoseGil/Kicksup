import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models';

/**
 * Componente de administración de órdenes
 */
@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./admin-orders.component.scss'],
  template: `
    <div class="admin-orders-container">
      <h2>Gestión de Pedidos</h2>

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
      } @else {
        <div class="orders-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.id) {
                <tr>
                  <td>{{ order.id.substring(0, 8) }}</td>
                  <td>{{ order.userId.substring(0, 8) }}</td>
                  <td>{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ order.items.length }}</td>
                  <td>{{ order.totalAmount | currency:'COP':'symbol-narrow':'1.0-0' }}</td>
                  <td>
                    <select
                      [ngModel]="order.status"
                      (ngModelChange)="updateOrderStatus(order.id, $event)"
                      class="status-select"
                    >
                      <option [ngValue]="1">Pendiente</option>
                      <option [ngValue]="2">Confirmado</option>
                      <option [ngValue]="3">Enviado</option>
                      <option [ngValue]="4">Entregado</option>
                      <option [ngValue]="5">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <button (click)="deleteOrder(order.id)" class="btn-delete">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (orders().length === 0) {
            <div class="no-orders">
              No hay pedidos {{ selectedStatus !== null ? 'con este estado' : '' }}
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
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

  protected updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    this.orderService.updateStatus(orderId, { status: newStatus }).subscribe({
      next: () => {
        alert('Estado actualizado exitosamente');
        this.loadOrders();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al actualizar el estado');
        this.loadOrders();
      }
    });
  }

  protected deleteOrder(orderId: string): void {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;

    this.orderService.delete(orderId).subscribe({
      next: () => {
        alert('Pedido eliminado exitosamente');
        this.loadOrders();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al eliminar el pedido');
      }
    });
  }
}
