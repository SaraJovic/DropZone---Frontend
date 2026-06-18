import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) {}

  getOrdersByUser(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  createOrder(data: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, data);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status?status=${status}`, {});
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }
}