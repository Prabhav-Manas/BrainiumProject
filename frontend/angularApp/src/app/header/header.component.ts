import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/appServices/auth.service';
import { navBarData } from './nav-data';
import { CartService } from '../appServices/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  collapsed: boolean = false;
  isProductMenuOpen: boolean = false;
  isCategoryMenuOpen: boolean = false;

  isLoggedIn: boolean = false;
  isSeller: boolean = false;
  firstName: string = '';

  cartItemCount: number = 0;

  constructor(
    private _authService: AuthService,
    private _cartService: CartService
  ) {}

  ngOnInit(): void {
    this._authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
      this.isSeller = this._authService.getUserRole() === 'seller';
      if (this.isLoggedIn) {
        this.firstName = this._authService.getFirstName();
        this.fetchCartItemCount();
      }
    });

    // Restore authentication state on component initialization
    this.isLoggedIn = this._authService.getIsAuth();
    this.isSeller = this._authService.getUserRole() === 'seller';
    if (this.isLoggedIn) {
      this.firstName = this._authService.getFirstName();
      this.fetchCartItemCount();
    }

    this._cartService.getCartItemCount().subscribe((count) => {
      this.cartItemCount = count;
    });

    this._cartService.cartUpdated.subscribe((count: number) => {
      this.cartItemCount = count;
    });
  }

  fetchCartItemCount() {
    this._cartService.getAllCartItems().subscribe(
      (cartData) => {
        this.cartItemCount = cartData.cartItems.length;
      },
      (error) => {
        console.log('Error Fetching Cart Items:=>', error);
      }
    );
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  closeSideNav() {
    this.collapsed = false;
  }

  toggleMenu(menu: string) {
    if (menu === 'product') {
      this.isProductMenuOpen = !this.isProductMenuOpen;
      this.isCategoryMenuOpen = false; // Close other menus
    } else if (menu === 'category') {
      this.isCategoryMenuOpen = !this.isCategoryMenuOpen;
      this.isProductMenuOpen = false; // Close other menus
    }
  }

  onLogOut() {
    this._authService.logOut();
  }
}
