import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CheckoutItem } from '../appModels/checkoutItem.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = environment.checkout;

  constructor(private http: HttpClient) {}

  createCheckoutSession(checkoutData: {
    name: string;
    address: string;
    paymentMethod: string;
    items: CheckoutItem[];
  }) {
    return this.http.post<any>(
      `${this.baseUrl}/create-checkout-session`,
      checkoutData
    );
  }
}
