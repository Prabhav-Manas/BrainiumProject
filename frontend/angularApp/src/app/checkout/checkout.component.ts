import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../appServices/checkout.service';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  UntypedFormBuilder,
} from '@angular/forms';
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
  selectedOption: string = 'Pay Now';
  onSelectPayNow: boolean = true;
  show: boolean = true;
  name: string = '';
  address: string = '';
  amount: number = 0;
  paymentStatus: string = '';

  // checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _checkoutService: CheckoutService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.amount = navigation.extras.state['subtotal'];
    }

    // this.checkoutForm = this.fb.group({
    //   name: [''],
    //   address: [''],
    // });
  }

  onSelectPay() {
    this.onSelectPayNow = true;
    this.show = true;
    this.paymentStatus = '';
    setTimeout(() => {
      this.mountStripeElement();
    }, 0);
  }

  onSelectCashOnDelivery() {
    this.onSelectPayNow = false;
    this.show = false;
    this.paymentStatus = '';
    this.unmountStripeElement();
  }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublicKey);

    // Mount the Stripe element by default if Pay Now is selected
    this.mountStripeElement();
  }

  mountStripeElement() {
    if (this.stripe && !this.card) {
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
  }

  unmountStripeElement() {
    if (this.card) {
      this.card.unmount();
      this.card = null;
    }
  }

  checkout(form: NgForm) {
    // event.preventDefault();

    if (this.onSelectPayNow) {
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
                this.paymentStatus = 'failed';
              } else {
                console.log('Payment successful!');
                this.paymentStatus = 'success';
                this.resetForm(form);
              }
            });
        },
        (error) => {
          console.error('Error creating payment intent:', error);
          this.paymentStatus = 'failed';
        }
      );
    } else {
      console.log('Order Placed with Cash On Delivery!');
      this.paymentStatus = 'order placed';
      this.resetForm(form);
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.name = '';
    this.address = '';
    this.selectedOption = 'Pay Now'; // Reset to Default Selection
    this.onSelectPayNow = true;
    this.show = true;
    this.unmountStripeElement();
    setTimeout(() => {
      this.mountStripeElement();
    }, 0);
  }
}
