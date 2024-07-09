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
    discount: number,
    images: File[]
  ) {
    const productData = new FormData();
    productData.append('category', category);
    productData.append('productName', productName);
    productData.append('description', description);
    productData.append('price', price.toString());
    productData.append('startDate', startDate);
    productData.append('closeDate', closeDate);
    productData.append('discount', discount.toString());

    for (let i = 0; i < images.length; i++) {
      productData.append('images', images[i], images[i].name);
    }

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

  getProductById(productId: any) {
    return this.http.get(`http://localhost:8080/api/product/${productId}`);
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

  updateCartItem(cartItemId: string, quantity: number): Observable<any> {
    const body = { cartItemId, quantity };
    return this.http.put('http://localhost:8080/api/cart/updateItem', body);
  }
}
