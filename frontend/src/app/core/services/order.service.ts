import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderStatus, CreateOrderRequest, UpdateOrderStatusRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  getAll(status?: OrderStatus): Observable<Order[]> {
    let params = new HttpParams();
    
    if (status !== undefined) {
      params = params.set('status', status.toString());
    }

    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  create(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateStatus(id: string, request: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
