import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, ProductSize, ProductColor } from '../../core/models';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./product-list.component.scss'],
  template: `
    <div class="products-container">
      <div class="filters-section">
        <h2>Catálogo de Productos</h2>
        
        <div class="filters">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onFilterChange()"
            placeholder="Buscar por nombre, descripción o código..."
            class="search-input"
          />

          <select [(ngModel)]="selectedSize" (ngModelChange)="onFilterChange()" class="filter-select">
            <option [ngValue]="null">Todas las tallas</option>
            <option [ngValue]="7">Talla 7</option>
            <option [ngValue]="8">Talla 8</option>
            <option [ngValue]="9">Talla 9</option>
            <option [ngValue]="10">Talla 10</option>
          </select>

          <select [(ngModel)]="selectedColor" (ngModelChange)="onFilterChange()" class="filter-select">
            <option [ngValue]="null">Todos los colores</option>
            <option [ngValue]="1">Blanco</option>
            <option [ngValue]="2">Negro</option>
            <option [ngValue]="3">Gris</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">Cargando productos...</div>
      } @else if (products().length === 0) {
        <div class="no-products">No se encontraron productos</div>
      } @else {
        <div class="products-grid">
          @for (product of products(); track product.id) {
            <div class="product-card">
              <img [src]="product.imageUrl" [alt]="product.name" class="product-image" />
              
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="product-code">Código: {{ product.code }}</p>
                <p class="product-price">{{ product.price | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
                
                <div class="product-details">
                  <span class="badge">Talla {{ product.sizeDisplay }}</span>
                  <span class="badge">{{ product.colorDisplay }}</span>
                  <span [class.in-stock]="product.isAvailable" [class.out-stock]="!product.isAvailable" class="badge">
                    {{ product.isAvailable ? 'Disponible' : 'Agotado' }}
                  </span>
                </div>

                <div class="product-actions">
                  <a [routerLink]="['/products', product.id]" class="btn-secondary">Ver Detalle</a>
                  <button
                    (click)="addToCart(product)"
                    [disabled]="!product.isAvailable"
                    class="btn-primary"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(false);
  protected searchTerm = '';
  protected selectedSize: ProductSize | null = null;
  protected selectedColor: ProductColor | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  protected onFilterChange(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    
    this.productService.getAll(
      this.searchTerm || undefined,
      this.selectedSize ?? undefined,
      this.selectedColor ?? undefined
    ).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  protected addToCart(product: Product): void {
    this.cartService.addItem(product, 1);
    alert(`${product.name} agregado al carrito!`);
  }
}
