import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8081/api/payments';

  constructor(private http: HttpClient) {}

  createPaymentIntent(orderId: number, currency: string = 'usd'): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(`${this.apiUrl}/create-payment-intent`, {
      orderId,
      currency
    });
  }
  confirmPaymentSuccess(orderId: number): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/confirm/${orderId}`, {});
}
}