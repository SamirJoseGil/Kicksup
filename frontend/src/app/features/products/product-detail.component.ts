import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  styleUrls: ['./product-detail.component.scss'],
  template: `
    <div class="detail-container">
      @if (loading()) {
        <div class="loading">Cargando producto...</div>
      } @else if (product()) {
        <div class="product-detail">
          <button (click)="goBack()" class="btn-back">← Volver al catálogo</button>

          <div class="detail-grid">
            <div class="image-section">
              <img [src]="product()!.imageUrl" [alt]="product()!.name" class="detail-image" />
            </div>

            <div class="info-section">
              <h1>{{ product()!.name }}</h1>
              <p class="code">Código: {{ product()!.code }}</p>
              
              <div class="price-section">
                <span class="price">{{ product()!.price | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                <span [class.available]="product()!.isAvailable" [class.unavailable]="!product()!.isAvailable" class="status">
                  {{ product()!.isAvailable ? '✓ Disponible' : '✗ Agotado' }}
                </span>
              </div>

              <div class="specs">
                <div class="spec-item">
                  <span class="spec-label">Talla:</span>
                  <span class="spec-value">{{ product()!.sizeDisplay }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Color:</span>
                  <span class="spec-value">{{ product()!.colorDisplay }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Stock:</span>
                  <span class="spec-value">{{ product()!.stock }} unidades</span>
                </div>
              </div>

              <div class="description">
                <h3>Descripción</h3>
                <p>{{ product()!.description }}</p>
              </div>

              <div class="quantity-section">
                <label for="quantity">Cantidad:</label>
                <div class="quantity-controls">
                  <button (click)="decreaseQuantity()" [disabled]="quantity() === 1" class="qty-btn">-</button>
                  <span class="qty-display">{{ quantity() }}</span>
                  <button (click)="increaseQuantity()" [disabled]="quantity() >= product()!.stock" class="qty-btn">+</button>
                </div>
              </div>

              <button
                (click)="addToCart()"
                [disabled]="!product()!.isAvailable"
                class="btn-add-cart"
              >
                {{ product()!.isAvailable ? 'Agregar al Carrito' : 'Producto Agotado' }}
              </button>
            </div>
          </div>
        </div>
      } @else {
        <div class="error">
          <p>Producto no encontrado</p>
          <button (click)="goBack()" class="btn-primary">Volver al catálogo</button>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(false);
  protected readonly quantity = signal(1);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  private loadProduct(id: string): void {
    this.loading.set(true);
    
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  protected increaseQuantity(): void {
    const current = this.quantity();
    const max = this.product()?.stock ?? 1;
    if (current < max) {
      this.quantity.set(current + 1);
    }
  }

  protected decreaseQuantity(): void {
    const current = this.quantity();
    if (current > 1) {
      this.quantity.set(current - 1);
    }
  }

  protected addToCart(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.addItem(prod, this.quantity());
      alert(`${this.quantity()} x ${prod.name} agregado al carrito!`);
      this.quantity.set(1);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/products']);
  }
}
