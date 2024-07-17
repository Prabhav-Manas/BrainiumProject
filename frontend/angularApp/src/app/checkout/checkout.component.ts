import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../appServices/checkout.service';
import { UntypedFormBuilder } from '@angular/forms';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  name: string = '';
  address: string = '';
  amount: number = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private _checkoutService: CheckoutService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.amount = navigation.extras.state['subtotal'];
    }
  }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublicKey);

    const elements = this.stripe?.elements();
    if (!elements) {
      console.error('Stripe elements could not be loaded.');
      return;
    }

    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError!.textContent = event.error.message;
      } else {
        displayError!.textContent = '';
      }
    });
  }

  checkout(event: Event) {
    event.preventDefault();

    this._checkoutService.createPaymentIntent(this.amount * 100).subscribe(
      (response) => {
        const paymentIntent = response.clientSecret;

        if (!this.stripe || !this.card || !paymentIntent) {
          console.error('Stripe or card element not properly initialized.');
          return;
        }

        this.stripe
          .confirmCardPayment(paymentIntent, {
            payment_method: {
              card: this.card,
              billing_details: {
                name: this.name,
              },
            },
            shipping: {
              name: this.name,
              address: {
                line1: this.address,
              },
            },
          })
          .then(({ error: confirmError }) => {
            if (confirmError) {
              console.error('Error confirming card payment:', confirmError);
            } else {
              console.log('Payment successful!');
            }
          });
      },
      (error) => {
        console.error('Error creating payment intent:', error);
      }
    );
  }
}
