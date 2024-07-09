import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutData = {
    name: '',
    address: '',
    paymentMethod: '',
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onBackToCart() {
    this.router.navigate(['/shopping-cart']);
  }

  onProceedToPay() {}
}
