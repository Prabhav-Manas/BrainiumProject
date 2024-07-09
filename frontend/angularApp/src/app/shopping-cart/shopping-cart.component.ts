import { Component, OnInit } from '@angular/core';
import { Product } from '../appModels/product-data.model';
import { CartService } from '../appServices/cart.service';
import { ProductService } from '../appServices/product.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(
    private _cartService: CartService,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchAllCartItems();
  }

  // ---Fetch All Cart Items---
  fetchAllCartItems() {
    this._cartService.getAllCartItems().subscribe(
      (cartData) => {
        console.log('cartData', cartData);
        this.cartItems = cartData.cartItems;
      },
      (error) => {
        console.log('Error Fetching Cart Items:=>', error);
      }
    );
  }

  // --- Update Cart Item (Only Quantity)---
  updateCartItem(item: any) {
    console.log(`Updating quantity for item ${item._id} to ${item.quantity}`);

    this._productService.updateCartItem(item._id, item.quantity).subscribe(
      (updatedItem: any) => {
        console.log(`Item ${item._id} updated successfully!`);
        // Update the local cartItems array or handle as per your application flow
        const index = this.cartItems.findIndex(
          (cartItem) => cartItem._id === updatedItem._id
        );
        if (index !== -1) {
          this.cartItems[index] = updatedItem;
        }
      },
      (error) => {
        console.error(`Error updating item ${item._id}:`, error);
      }
    );
  }

  // ---Remove a Single Cart Item---
  onRemoveCartItem(cartItemId: string) {
    this._cartService.removeCartItem(cartItemId).subscribe(
      (res) => {
        this.cartItems = this.cartItems.filter(
          (item) => item._id !== cartItemId
        );
        this.fetchAllCartItems();
      },
      (error) => {
        console.log('Error in removing Cart Item', error);
      }
    );
  }

  // ---Calculate Sub Total for Bill in Cart---
  calculateSubTotal(): number {
    return this.cartItems.reduce((acc, item) => {
      if (item.product.price && item.quantity) {
        return acc + item.quantity * item.product.price;
      } else {
        return acc;
      }
    }, 0);
  }
}
