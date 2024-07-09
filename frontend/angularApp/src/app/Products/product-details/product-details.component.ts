import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/appModels/product-data.model';
import { CartService } from 'src/app/appServices/cart.service';
import { ProductService } from 'src/app/appServices/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  quantity: number = 1;

  constructor(
    private _productService: ProductService,
    private _cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.fetchProductDetails(productId);
    }
  }

  fetchProductDetails(id: string) {
    this._productService.getProductById(id).subscribe(
      (data: any) => {
        this.product = data.product;
        console.log(this.product);
      },
      (error) => {
        console.log('Error fetching product details', error);
      }
    );
  }

  onAddToCart() {
    this._cartService.addToCart(this.product._id, this.quantity).subscribe(
      (res) => {
        if (res) {
          alert('Product already exist in your cart.');
        } else {
          alert('Item added in cart');
          this.router.navigate(['/shopping-cart']);
          console.log(res);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
