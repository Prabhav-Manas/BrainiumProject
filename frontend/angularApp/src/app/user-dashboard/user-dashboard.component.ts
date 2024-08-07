import { Component, OnInit } from '@angular/core';
import { AuthService } from '../appServices/auth.service';
import { ProductService } from '../appServices/product.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  products: any[] = [];

  constructor(
    private _authService: AuthService,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  fetchAllProducts() {
    this._productService.getAllProducts().subscribe(
      (data) => {
        this.products = data.products;
        console.log(this.products[0].imagePath);
      },
      (error) => {
        console.log('Error fetching products', error);
      }
    );
  }

  onLogOut() {
    this._authService.logOut();
  }
}
