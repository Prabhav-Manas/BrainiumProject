import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../appServices/checkout.service';
import { AuthService } from '../appServices/auth.service';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css'],
})
export class SellerDashboardComponent implements OnInit {
  orders: any[] = [];
  userId: string = 'userId';
  sellerId: any = '';

  constructor(
    private _checkoutService: CheckoutService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.userId = '66815fbc9c3f8b13871b6fe3';
    this.sellerId = localStorage.getItem('userId');
    console.log(this.sellerId);
    this.fetchOrders();
  }

  fetchOrders() {
    this._checkoutService.getSellerOrders(this.sellerId).subscribe(
      (res: any) => {
        if (res) {
          this.orders = res.orders;
          console.log('All Orders:=>', this.orders);
        }
      },
      (error) => {
        console.log('Failed to fetch orders', error);
      }
    );
  }
}
