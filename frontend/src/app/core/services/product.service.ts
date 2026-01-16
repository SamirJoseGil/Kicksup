import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductColor, ProductSize, CreateProductRequest, UpdateProductRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

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

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: string, product: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
