import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductColor, ProductSize, CreateProductRequest, UpdateProductRequest } from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para manejo de productos
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  /**
   * Obtiene todos los productos con filtros opcionales
   */
  getAll(searchTerm?: string, size?: ProductSize, color?: ProductColor): Observable<Product[]> {
    let params = new HttpParams();
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    if (size !== undefined) {
      params = params.set('size', size.toString());
    }
    if (color !== undefined) {
      params = params.set('color', color.toString());
    }

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un producto por ID
   */
  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo producto
   */
  create(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Actualiza un producto existente
   */
  update(id: string, product: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Elimina un producto
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
