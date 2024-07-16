import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../appServices/checkout.service';
// import { loadStripe } from '@stripe/stripe-js';
import { CheckoutItem } from '../appModels/checkoutItem.model';
import { injectStripe, StripePaymentElementComponent } from 'ngx-stripe';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {
  StripeElementsOptions,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';
import { PaymentService } from '../appServices/payment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  paymentElementForm = this.fb.group({
    name: ['John Doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [0, [Validators.required, Validators.pattern(/\d+/)]],
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    clientSecret: '',
    appearance: { theme: 'flat' },
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  stripe = injectStripe(
    '{{pk_test_51PacOZ2KZ7ovD5V6PkZZKPjfTarqVidUtBCEgZcIEqOZKFqeMwP2EvuWmnj2vnRXMk0Aj1KSxdGqbaN7GY7D3dPG00FzHGAJvp}}'
  );
  // paying = signal(false);

  cartItems: any[] = [];
  subtotal: number = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private _paymentService: PaymentService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as {
        cartItems: any[];
        subtotal: number;
      };
      this.cartItems = state.cartItems;
      this.subtotal = state.subtotal;
      this.paymentElementForm.patchValue({ amount: this.subtotal });
    }
  }

  ngOnInit(): void {
    this._paymentService
      .createPaymentIntent(this.paymentElementForm.value.amount)
      .subscribe(
        ({ clientSecret }) => {
          this.elementsOptions.clientSecret = clientSecret;
        },
        (error) => {
          console.log('Error in payment-intent', error);
        }
      );
  }

  pay() {
    if (this.paymentElementForm.invalid) {
      return;
    }

    if (!this.paymentElement?.elements) {
      console.error('Stripe elements not initialized');
      return;
    }

    const { name, email, address, zipcode, city } =
      this.paymentElementForm.getRawValue();

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                city: city as string,
              },
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe((result: any) => {
        // this.paying.set(false);

        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
  }
}
