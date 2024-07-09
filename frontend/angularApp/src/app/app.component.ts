import { Component, OnInit } from '@angular/core';
import { AuthService } from './appServices/auth.service';
import { CartService } from './appServices/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _cartService: CartService
  ) {}

  ngOnInit(): void {
    this._authService.autoAuthData();

    this._cartService.getAllCartItems().subscribe();
  }
}
