import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

/**
 * Componente del carrito de compras
 */
@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./cart.component.scss'],
  template: `
    <div class="cart-container">
      <h2>Carrito de Compras</h2>

      @if (items().length === 0) {
        <div class="empty-cart">
          <p>Tu carrito está vacío</p>
          <a routerLink="/products" class="btn-primary">Ir al Catálogo</a>
        </div>
      } @else {
        <div class="cart-content">
          <div class="cart-items">
            @for (item of items(); track item.productId) {
              <div class="cart-item">
                <img [src]="item.imageUrl" [alt]="item.productName" class="item-image" />
                
                <div class="item-info">
                  <h3>{{ item.productName }}</h3>
                  <p class="item-price">{{ item.price | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                  <div class="item-specs">
                    <span class="spec-badge">Talla {{ item.sizeDisplay }}</span>
                    <span class="spec-badge">{{ item.colorDisplay }}</span>
                  </div>
                </div>

                <div class="item-actions">
                  <div class="quantity-controls">
                    <button (click)="updateQuantity(item.productId, item.quantity - 1)" [disabled]="item.quantity === 1" class="qty-btn">-</button>
                    <span class="qty-display">{{ item.quantity }}</span>
                    <button (click)="updateQuantity(item.productId, item.quantity + 1)" class="qty-btn">+</button>
                  </div>
                  
                  <p class="item-subtotal">{{ item.subtotal | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                  
                  <button (click)="removeItem(item.productId)" class="btn-remove">Eliminar</button>
                </div>
              </div>
            }
          </div>

          <div class="cart-summary">
            <h3>Resumen del Pedido</h3>
            
            <div class="summary-row">
              <span>Productos ({{ totalItems() }})</span>
              <span>{{ totalAmount() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            </div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ totalAmount() | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            </div>

            @if (!isAuthenticated()) {
              <p class="auth-message">Debes iniciar sesión para crear un pedido</p>
              <a routerLink="/auth/login" class="btn-primary">Iniciar Sesión</a>
            } @else {
              <button (click)="checkout()" class="btn-primary">Crear Pedido</button>
            }

            <button (click)="clearCart()" class="btn-secondary">Vaciar Carrito</button>
          </div>
        </div>
      }
    </div>
  `
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly items = this.cartService.items;
  protected readonly totalItems = this.cartService.totalItems;
  protected readonly totalAmount = this.cartService.totalAmount;
  protected readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  protected updateQuantity(productId: string, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  protected removeItem(productId: string): void {
    if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      this.cartService.removeItem(productId);
    }
  }

  protected clearCart(): void {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
      this.cartService.clearCart();
    }
  }

  protected checkout(): void {
    this.router.navigate(['/orders/create']);
  }
}
