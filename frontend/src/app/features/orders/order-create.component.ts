import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';
import { CreateOrderRequest } from '../../core/models';

@Component({
  selector: 'app-order-create',
  imports: [CommonModule],
  styleUrls: ['./order-create.component.scss'],
  template: `
    <div class="create-container">
      <h2>Confirmar Pedido</h2>

      @if (cartItems().length === 0) {
        <div class="empty-cart">
          <p>No hay productos en el carrito</p>
          <button (click)="goToProducts()" class="btn-primary">Ir al Catálogo</button>
        </div>
      } @else {
        <div class="order-preview">
          <div class="items-section">
            <h3>Productos</h3>
            @for (item of cartItems(); track item.productId) {
              <div class="order-item">
                <img [src]="item.imageUrl" [alt]="item.productName" class="item-image" />
                <div class="item-details">
                  <h4>{{ item.productName }}</h4>
                  <p>{{ item.price | currency:'COP':'symbol-narrow':'1.0-0' }} x {{ item.quantity }}</p>
                  <span class="item-subtotal">{{ item.subtotal | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                </div>
              </div>
            }
          </div>

          <div class="summary-section">
            <h3>Resumen</h3>
            <div class="summary-row">
              <span>Total de productos:</span>
              <span>{{ totalItems() }}</span>
            </div>
            <div class="summary-row total">
              <span>Total a pagar:</span>
              <span>{{ totalAmount() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            </div>

            @if (error()) {
              <div class="error-message">{{ error() }}</div>
            }

            <button
              (click)="confirmOrder()"
              [disabled]="loading()"
              class="btn-confirm"
            >
              {{ loading() ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
            <button (click)="goBack()" class="btn-secondary">Volver al Carrito</button>
          </div>
        </div>
      }
    </div>
  `
})
export class OrderCreateComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected readonly cartItems = this.cartService.items;
  protected readonly totalItems = this.cartService.totalItems;
  protected readonly totalAmount = this.cartService.totalAmount;
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    if (this.cartItems().length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  protected confirmOrder(): void {
    this.loading.set(true);
    this.error.set(null);

    const request: CreateOrderRequest = {
      items: this.cartItems().map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.create(request).subscribe({
      next: (order) => {
        this.loading.set(false);
        this.cartService.clearCart();
        alert('¡Pedido creado exitosamente!');
        this.router.navigate(['/orders', order.id]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al crear el pedido');
      }
    });
  }

  protected goBack(): void {
    this.router.navigate(['/cart']);
  }

  protected goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
