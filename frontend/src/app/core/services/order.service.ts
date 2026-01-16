import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderStatus, CreateOrderRequest, UpdateOrderStatusRequest } from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para manejo de órdenes
 */
@Injectable({
  providedIn: 'root'
})

// Servicio para manejo de órdenes
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  // Obtiene todas las órdenes con filtro opcional por estado
  getAll(status?: OrderStatus): Observable<Order[]> {
    let params = new HttpParams();
    
    if (status !== undefined) {
      params = params.set('status', status.toString());
    }

    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  // Obtiene una orden por ID
  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Crea una nueva orden
  create(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  // Actualiza el estado de una orden
  updateStatus(id: string, request: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, request);
  }

  // Elimina una orden
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
