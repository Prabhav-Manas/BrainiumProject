import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CheckoutItem } from '../appModels/checkoutItem.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = environment.checkout;

  constructor(private http: HttpClient) {}

  // createPaymentIntent(amount: number): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/payment-intent`, { amount });
  // }

  createPaymentIntent(
    amount: number,
    userId: string,
    name: string,
    address: string
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/payment-intent`, {
      amount,
      userId,
      name,
      address,
    });
  }

  saveOrderDetails(
    userId: string,
    name: string,
    address: string,
    amount: number,
    paymentIntentId?: string
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save-order`, {
      userId,
      name,
      address,
      amount,
      paymentIntentId,
    });
  }

  updatePaymentStatus(
    paymentIntentId: string,
    status: string
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update-payment-status`, {
      paymentIntentId,
      status,
    });
  }
}
