import { Component, OnInit } from '@angular/core';
import { AuthService } from './appServices/auth.service';
import { CartService } from './appServices/cart.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userType: any = '';
  isSeller: boolean = false;

  isSidebarExpanded: boolean = false; // Track the sidebar state

  constructor(
    private _authService: AuthService,
    private _cartService: CartService
  ) {}

  ngOnInit(): void {
    this._authService.autoAuthData();

    if (this._authService.getIsAuth()) {
      this._cartService.getAllCartItems().subscribe();
    }

    this._authService.userRole$.subscribe((role) => {
      this.userType = role;
      this.isSeller = this.userType === 'seller';
      console.log('UserType:=>', this.userType);
    });
  }

  onSidebarToggle(expanded: boolean) {
    this.isSidebarExpanded = expanded; // Update the sidebar state
  }
}
