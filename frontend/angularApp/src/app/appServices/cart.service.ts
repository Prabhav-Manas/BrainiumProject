import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../appModels/product-data.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<Product[]>([]);
  private cartItemCount = new BehaviorSubject<number>(0);
  cartUpdated = new EventEmitter<number>();

  private baseUrl = environment.myCart;

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }

  // ---Add To Cart Items---
  addToCart(productId: string, quantity: number): Observable<any> {
    const userId = this.getUserId();
    return this.http
      .post<Product>(`${this.baseUrl}/addCartItems`, {
        productId,
        quantity,
        userId,
      })
      .pipe(
        tap(() => {
          this.getAllCartItems().subscribe();
          this.cartItemCount.next(this.cartItemCount.value + 1);
          this.cartUpdated.emit(this.cartItemCount.value);
        })
      );
  }

  // ---Fetch All Cart Items---
  getAllCartItems() {
    return this.http.get<any>(`${this.baseUrl}/getCartItems`).pipe(
      tap((cartData: any) => {
        const products = cartData.cartItems.map((item: any) => item.product);
        this.cartSubject.next(products);
        this.cartItemCount.next(cartData.cartItems.length);
        this.cartUpdated.emit(this.cartItemCount.value);

        // this.cartItemCount.next(cartData.cartItems.length);
        // this.cartUpdated.emit(this.cartItemCount.value);
      })
    );
  }

  // ---Update Cart Items---
  updateCartItem(cartItemId: string, quantity: number) {
    return this.http.put(`${this.baseUrl}/updateItem`, {
      cartItemId,
      quantity,
    });
  }

  // ---Remove Item From Cart---
  removeCartItem(cartItemId: string) {
    return this.http
      .delete(`${this.baseUrl}/removeCartItem/${cartItemId}`)
      .pipe(
        tap(() => {
          this.getAllCartItems().subscribe();
          this.cartItemCount.next(this.cartItemCount.value - 1);
          this.cartUpdated.emit(this.cartItemCount.value);
        })
      );
  }

  // ---Cart Number of Items in Cart---
  getCartItemCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }

  clearCart() {
    this.cartSubject.next([]);
    this.cartItemCount.next(0);
    this.cartUpdated.emit(0);
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.user._id;
    }
    return null;
  }
}
