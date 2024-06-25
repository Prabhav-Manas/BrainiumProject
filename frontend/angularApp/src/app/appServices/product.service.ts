import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../appModels/product-data.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  addProduct(
    category: string,
    productName: string,
    description: string,
    price: number,
    startDate: string,
    closeDate: string,
    discount: number
  ) {
    const productData = {
      category,
      productName,
      description,
      price,
      startDate,
      closeDate,
      discount,
    };
    return this.http.post(
      'http://localhost:8080/api/product/add-product',
      productData
    );
  }

  getProducts(
    postsPerPage: number,
    currentPage: number
  ): Observable<{ products: Product[]; maxProducts: number }> {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    return this.http
      .get<{ products: Product[]; maxProducts: number }>(
        'http://localhost:8080/api/product/all-products' + queryParams
      )
      .pipe(
        map((responseData) => {
          return {
            products: responseData.products,
            maxProducts: responseData.maxProducts,
          };
        })
      );
  }

  updateProduct(product: Product) {
    console.log('Update Product Service - Product ID:', product._id);
    return this.http.put(
      `http://localhost:8080/api/product/${product._id}`,
      product
    );
  }

  deleteProduct(product: Product) {
    return this.http.delete(`http://localhost:8080/api/product/${product._id}`);
  }

  // Fetch all products without pagination
  getAllProducts(): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(
      'http://localhost:8080/api/product/all-products'
    );
  }
}
