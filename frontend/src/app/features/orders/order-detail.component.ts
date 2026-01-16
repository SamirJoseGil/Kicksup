import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./order-detail.component.scss'],
  template: `
    <div class="detail-container">
      @if (loading()) {
        <div class="loading">Cargando pedido...</div>
      } @else if (order()) {
        <div class="order-detail">
          <button (click)="goBack()" class="btn-back">← Volver a Mis Pedidos</button>

          <div class="detail-header">
            <div>
              <h1>Pedido #{{ order()!.id.substring(0, 8) }}</h1>
              <p class="order-date">Creado el {{ order()!.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
            <span [class]="'status status-' + order()!.status" class="status-badge">
              {{ getStatusText(order()!.status) }}
            </span>
          </div>

          <div class="detail-content">
            <div class="items-section">
              <h2>Productos</h2>
              <div class="items-list">
                @for (item of order()!.items; track item.productId) {
                  <a [routerLink]="['/products', item.productId]" class="order-item">
                    <img [src]="item.productImageUrl" [alt]="item.productName" class="item-image" />
                    <div class="item-info">
                      <h3>{{ item.productName }}</h3>
                      <p class="item-code">{{ item.productCode }}</p>
                      <div class="item-specs">
                        <span class="spec-badge">Talla {{ item.sizeDisplay }}</span>
                        <span class="spec-badge">{{ item.colorDisplay }}</span>
                      </div>
                    </div>
                    <div class="item-pricing">
                      <p class="item-price">{{ item.price | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                      <p class="item-quantity">Cantidad: {{ item.quantity }}</p>
                      <p class="item-subtotal">{{ item.subtotal | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                    </div>
                  </a>
                }
              </div>
            </div>

            <div class="summary-section">
              <h2>Resumen</h2>
              
              <div class="summary-info">
                <div class="info-row">
                  <span>ID del pedido:</span>
                  <span class="info-value">{{ order()!.id }}</span>
                </div>
                <div class="info-row">
                  <span>Estado:</span>
                  <span [class]="'status status-' + order()!.status" class="status-badge-small">
                    {{ getStatusText(order()!.status) }}
                  </span>
                </div>
                <div class="info-row">
                  <span>Total de productos:</span>
                  <span class="info-value">{{ order()!.items.length }}</span>
                </div>
                <div class="info-row">
                  <span>Cantidad total:</span>
                  <span class="info-value">{{ getTotalQuantity() }}</span>
                </div>
                <div class="info-row total">
                  <span>Total:</span>
                  <span class="total-amount">{{ order()!.totalAmount | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                </div>
              </div>

              <div class="actions">
                <a routerLink="/products" class="btn-primary">Seguir Comprando</a>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="error">
          <p>Pedido no encontrado</p>
          <button (click)="goBack()" class="btn-primary">Volver a Mis Pedidos</button>
        </div>
      }
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    }
  }

  private loadOrder(id: string): void {
    this.loading.set(true);

    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  protected getTotalQuantity(): number {
    return this.order()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
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

  protected goBack(): void {
    this.router.navigate(['/orders']);
  }
}
