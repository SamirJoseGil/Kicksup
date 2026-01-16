import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductSize, ProductColor } from '../../core/models';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./admin-products.component.scss'],
  template: `
    <div class="admin-products-container">
      <div class="header">
        <h2>Gestión de Productos</h2>
        <button (click)="showCreateForm()" class="btn-create">+ Nuevo Producto</button>
      </div>

      <div class="filters">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onFilterChange()"
          placeholder="Buscar por código o nombre..."
          class="search-input"
        />
        <select [(ngModel)]="filterSize" (ngModelChange)="onFilterChange()" class="filter-select">
          <option [ngValue]="null">Todas las tallas</option>
          <option [ngValue]="7">Talla 7</option>
          <option [ngValue]="8">Talla 8</option>
          <option [ngValue]="9">Talla 9</option>
          <option [ngValue]="10">Talla 10</option>
        </select>
        <select [(ngModel)]="filterColor" (ngModelChange)="onFilterChange()" class="filter-select">
          <option [ngValue]="null">Todos los colores</option>
          <option [ngValue]="1">Blanco</option>
          <option [ngValue]="2">Negro</option>
          <option [ngValue]="3">Gris</option>
        </select>
      </div>

      @if (creating()) {
        <div class="form-modal">
          <div class="modal-content">
            <h3>{{ editingId() ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
            
            <form (ngSubmit)="saveProduct()" class="product-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Código *</label>
                  <input type="text" [(ngModel)]="form.code" name="code" required class="form-input" />
                </div>
                <div class="form-group">
                  <label>Nombre *</label>
                  <input type="text" [(ngModel)]="form.name" name="name" required class="form-input" />
                </div>
              </div>

              <div class="form-group">
                <label>Descripción *</label>
                <textarea [(ngModel)]="form.description" name="description" required rows="3" class="form-input"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Talla *</label>
                  <select [(ngModel)]="form.size" name="size" required class="form-input">
                    <option [ngValue]="7">Talla 7</option>
                    <option [ngValue]="8">Talla 8</option>
                    <option [ngValue]="9">Talla 9</option>
                    <option [ngValue]="10">Talla 10</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Color *</label>
                  <select [(ngModel)]="form.color" name="color" required class="form-input">
                    <option [ngValue]="1">Blanco</option>
                    <option [ngValue]="2">Negro</option>
                    <option [ngValue]="3">Gris</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Precio (COP) *</label>
                  <input type="number" [(ngModel)]="form.price" name="price" required min="0" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Stock *</label>
                  <input type="number" [(ngModel)]="form.stock" name="stock" required min="0" class="form-input" />
                </div>
              </div>

              <div class="form-group image-upload-group">
                <label>Imagen del Producto *</label>
                
                <div class="image-source-toggle">
                  <button 
                    type="button" 
                    [class.active]="imageSourceType() === 'upload'" 
                    (click)="setImageSourceType('upload')"
                  >
                    Subir Imagen
                  </button>
                  <button 
                    type="button" 
                    [class.active]="imageSourceType() === 'url'" 
                    (click)="setImageSourceType('url')"
                  >
                    URL Externa
                  </button>
                </div>

                @if (imageSourceType() === 'url') {
                  <div class="url-input-container">
                    <input 
                      type="url" 
                      [(ngModel)]="form.imageUrl" 
                      name="imageUrl" 
                      placeholder="https://ejemplo.com/imagen.jpg"
                      class="form-input"
                    />
                    @if (form.imageUrl) {
                      <div class="image-preview url-preview">
                        <img [src]="form.imageUrl" alt="Preview" (error)="onImageError()" />
                      </div>
                    }
                  </div>
                } @else {
                  <div class="image-upload-container">
                    @if (form.imageUrl) {
                      <div class="image-preview">
                        <img [src]="form.imageUrl" alt="Preview" />
                        <button type="button" (click)="removeImage()" class="remove-image-btn">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    } @else {
                      <div class="upload-zone" (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L12 8L17 13H14Z" fill="currentColor"/>
                        </svg>
                        <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                        <span>PNG, JPG hasta 5MB</span>
                      </div>
                    }
                    <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" hidden />
                  </div>
                }
              </div>

              @if (error()) {
                <div class="error-message">{{ error() }}</div>
              }

              <div class="form-actions">
                <button type="button" (click)="cancelForm()" class="btn-cancel">Cancelar</button>
                <button type="submit" [disabled]="loading()" class="btn-save">
                  {{ loading() ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (loadingList()) {
        <div class="loading">Cargando productos...</div>
      } @else {
        <div class="products-table">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products(); track product.id) {
                <tr>
                  <td>{{ product.code }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.sizeDisplay }}</td>
                  <td>{{ product.colorDisplay }}</td>
                  <td>{{ product.price | currency:'COP':'symbol-narrow':'1.0-0' }}</td>
                  <td [class.low-stock]="product.stock <= 5">{{ product.stock }}</td>
                  <td>
                    <span [class.available]="product.isAvailable" [class.unavailable]="!product.isAvailable" class="status-badge">
                      {{ product.isAvailable ? 'Disponible' : 'Agotado' }}
                    </span>
                  </td>
                  <td>
                    <div class="actions">
                      <button (click)="editProduct(product)" class="btn-edit">Editar</button>
                      <button (click)="deleteProduct(product.id)" class="btn-delete">Eliminar</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);

  protected readonly products = signal<Product[]>([]);
  protected readonly loadingList = signal(false);
  protected readonly loading = signal(false);
  protected readonly creating = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly imageSourceType = signal<'upload' | 'url'>('upload');

  // Filter properties
  protected searchTerm = '';
  protected filterSize: ProductSize | null = null;
  protected filterColor: ProductColor | null = null;

  protected form = {
    code: '',
    name: '',
    description: '',
    size: 9 as ProductSize,
    color: 1 as ProductColor,
    price: 0,
    stock: 0,
    imageUrl: ''
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  protected onFilterChange(): void {
    this.loadProducts();
  }

  protected setImageSourceType(type: 'upload' | 'url'): void {
    this.imageSourceType.set(type);
    // Clear image when switching types
    if (type === 'url' && this.form.imageUrl.startsWith('data:')) {
      this.form.imageUrl = '';
    } else if (type === 'upload' && this.form.imageUrl.startsWith('http')) {
      this.form.imageUrl = '';
    }
  }

  protected onImageError(): void {
    this.error.set('No se pudo cargar la imagen desde la URL proporcionada');
  }

  private loadProducts(): void {
    this.loadingList.set(true);
    this.productService.getAll(
      this.searchTerm || undefined,
      this.filterSize ?? undefined,
      this.filterColor ?? undefined
    ).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loadingList.set(false);
      },
      error: () => {
        this.loadingList.set(false);
      }
    });
  }

  protected showCreateForm(): void {
    this.resetForm();
    this.creating.set(true);
    this.editingId.set(null);
  }

  protected editProduct(product: Product): void {
    this.form = {
      code: product.code,
      name: product.name,
      description: product.description,
      size: product.size,
      color: product.color,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl
    };
    // Detect image source type
    if (product.imageUrl.startsWith('http')) {
      this.imageSourceType.set('url');
    } else {
      this.imageSourceType.set('upload');
    }
    this.editingId.set(product.id);
    this.creating.set(true);
  }

  protected saveProduct(): void {
    this.loading.set(true);
    this.error.set(null);

    const request = { ...this.form };

    const operation = this.editingId()
      ? this.productService.update(this.editingId()!, request)
      : this.productService.create(request);

    operation.subscribe({
      next: () => {
        this.loading.set(false);
        this.creating.set(false);
        this.loadProducts();
        alert('Producto guardado exitosamente');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al guardar el producto');
      }
    });
  }

  protected deleteProduct(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.loadProducts();
        alert('Producto eliminado exitosamente');
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.error?.error || 'Error al eliminar el producto';
        alert(errorMessage);
      }
    });
  }

  protected cancelForm(): void {
    this.creating.set(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.form = {
      code: '',
      name: '',
      description: '',
      size: 9,
      color: 1,
      price: 0,
      stock: 0,
      imageUrl: ''
    };
    this.editingId.set(null);
    this.error.set(null);
    this.imageSourceType.set('upload');
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.error.set('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.error.set('La imagen no puede superar los 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.imageUrl = reader.result as string;
      this.error.set(null);
    };
    reader.onerror = () => {
      this.error.set('Error al procesar la imagen');
    };
    reader.readAsDataURL(file);
  }

  protected removeImage(): void {
    this.form.imageUrl = '';
  }
}
