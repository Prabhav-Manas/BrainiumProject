import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/appModels/product-data.model';
import { ProductService } from 'src/app/appServices/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: any[] = [];

  constructor(
    private _productService: ProductService,
    private route: ActivatedRoute
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
        this.product = [data.product];
        console.log(this.product);
      },
      (error) => {
        console.log('Error fetching product details', error);
      }
    );
  }
}
