import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../appModels/product-data.model';
import { myCart } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<Product[]>([]);
  private cartItemCount = new BehaviorSubject<number>(0);

  private baseUrl = myCart.baseUrl;

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    const userId = '';
    return this.http.post<Product>(`${this.baseUrl}/addCartItems`, {
      productId,
      quantity,
      userId,
    });
  }

  getAllCartItems() {
    return this.http.get<any>(`${this.baseUrl}/getCartItems`).pipe(
      tap((cartData: any) => {
        this.cartItemCount.next(cartData.cartItems.length);
      })
    );
  }

  updateCartItem(cartItemId: string, quantity: number) {
    return this.http.put(`${this.baseUrl}/updateItem`, {
      cartItemId,
      quantity,
    });
  }

  removeCartItem(cartItemId: string) {
    return this.http
      .delete(`${this.baseUrl}/removeCartItem/${cartItemId}`, {})
      .pipe(
        tap(() => {
          this.getAllCartItems().subscribe();
        })
      );
  }

  getCartItemCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }
}
