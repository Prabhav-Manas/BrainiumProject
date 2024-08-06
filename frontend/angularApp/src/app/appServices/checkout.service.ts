import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CartItems } from '../appModels/cartItem.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = environment.checkout;

  constructor(private http: HttpClient) {}

  createPaymentIntent(
    amount: number,
    userId: string,
    name: string,
    delivery: { address: string; deliveryStatus: string },
    cartItems: CartItems[]
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/payment-intent`, {
      amount,
      userId,
      name,
      delivery,
      cartItems,
    });
  }

  saveOrderDetails(
    userId: string,
    name: string,
    amount: number,
    payment: any,
    cartItems: CartItems[],
    delivery: { address: string; deliveryStatus: string }
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save-order`, {
      userId,
      name,
      amount,
      payment,
      cartItems,
      delivery,
    });
  }

  updatePaymentStatus(paymentId: any, status: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update-payment-status`, {
      payment: { id: paymentId },
      status,
    });
  }

  // getOrderHistory(userId: string): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/order-history/${userId}`);
  // }

  getOrderHistory(userId?: string): Observable<any> {
    const url = userId
      ? `${this.baseUrl}/order-history/${userId}`
      : `${this.baseUrl}/order-history`;
    return this.http.get<any>(url);
  }

  getSellerOrders(sellerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/seller-orders/${sellerId}`);
  }
}
