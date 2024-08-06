import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../appServices/checkout.service';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElements,
} from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
// import { OrderHistoryService } from '../appServices/order-history.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  stripe: Stripe | null = null;
  elements!: StripeElements | null;
  card: StripeCardElement | null = null;
  amount: number = 0;
  userId: any = '';
  name: string = '';
  address: string = '';
  deliveryAddress: string = '';
  cartItems: any[] = [];
  paymentStatus: string = '';
  selectedOption: string = 'Pay Now';
  onSelectPayNow: boolean = true;
  show: boolean = true;

  constructor(
    private _checkoutService: CheckoutService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.amount = navigation.extras.state['subtotal'];
      this.cartItems = navigation.extras.state['cartItems'] || [];
      console.log('Initialized cartItems:', this.cartItems); // Debugging line
    }
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

    // Retrieve User Details
    this.userId = localStorage.getItem('userId'); // Ensure this retrieves the correct value
    console.log('Retrieved userId:', this.userId); // Add this line to debug
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

  async checkout(form: NgForm) {
    console.log('Checkout cartItems:', this.cartItems); // Debugging line

    // Check the structure of cartItems
    if (!Array.isArray(this.cartItems)) {
      console.error('Cart items is not an array!');
      return;
    }

    // Ensure each item has a valid productId and quantity
    this.cartItems.forEach((item, index) => {
      console.log(`Cart item ${index + 1}:`, item); // Debugging line
      if (!item.product || !item.product._id) {
        console.error(`Cart item ${index + 1} is missing productId!`);
      } else {
        item.productId = item.product._id; // Add this line to set productId
      }
      if (!item.quantity) {
        console.error(`Cart item ${index + 1} is missing quantity!`);
      }
    });

    this.cartItems.forEach((item) => {
      console.log('Cart item:', item); // Detailed Debugging line
      // console.log('Cart item productId:', item.productId); // Debugging line
      console.log('Cart item productId:', item.product._id); // Debugging line
      console.log('Cart item quantity:', item.quantity); // Debugging line
    });

    if (this.cartItems.length === 0) {
      console.error('Cart is empty!');
      return;
    }

    const delivery = {
      address: this.address,
      deliveryStatus: 'processing',
    };

    if (this.onSelectPayNow) {
      this._checkoutService
        .createPaymentIntent(
          this.amount * 100,
          this.userId,
          this.name,
          delivery,
          this.cartItems
        )
        .subscribe(
          (response) => {
            console.log('Check For CreatePaymentIntent CartItems:=>', response);
            const paymentIntentId = response.paymentIntentId;

            if (!this.stripe || !this.card || !paymentIntentId) {
              console.log('Stripe or card element not properly initialized.');
              return;
            }

            this.stripe
              .confirmCardPayment(response.clientSecret, {
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
              .then(({ error: confirmError, paymentIntent }) => {
                if (confirmError) {
                  console.log('Error confirming card payment:', confirmError);
                  this.paymentStatus = 'failed';
                } else if (
                  paymentIntent &&
                  paymentIntent.status === 'succeeded'
                ) {
                  console.log('Payment successful!');
                  this.paymentStatus = 'success';

                  // Update Payment Status on Server
                  this._checkoutService
                    .updatePaymentStatus(paymentIntentId, 'completed')
                    .subscribe(() => {
                      this._checkoutService
                        .saveOrderDetails(
                          this.userId,
                          this.name,
                          this.amount,
                          paymentIntentId,
                          this.cartItems,
                          delivery
                        )
                        .subscribe(() => {
                          this.resetForm(form);
                        });
                    });
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
      this.paymentStatus = 'Order placed';
      this._checkoutService
        .saveOrderDetails(
          this.userId,
          this.name,
          this.amount,
          { id: 'COD', status: 'pending' },
          this.cartItems,
          delivery
        )
        .subscribe((res) => {
          console.log('Order placed with COD:', res);
          this.resetForm(form);
        });
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
