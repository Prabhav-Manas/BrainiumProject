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
    image: File
  ) {
    const productData = new FormData();
    productData.append('category', category);
    productData.append('productName', productName);
    productData.append('description', description);
    productData.append('price', price.toString());
    productData.append('startDate', new Date(startDate).toISOString()); // Ensure date is in ISO format
    productData.append('closeDate', new Date(closeDate).toISOString());
    productData.append('discount', discount.toString());
    productData.append('image', image);

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

  updateProduct(product: Product, image?: File) {
    console.log('Update Product Service - Product ID:', product._id);
    const formData = new FormData();
    formData.append('_id', product._id);
    formData.append('category', product.category);
    formData.append('productName', product.productName);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('startDate', product.startDate.toString());
    formData.append('closeDate', product.closeDate.toString());
    formData.append('discount', product.discount.toString());

    if (image) {
      formData.append('image', image);
    }
    return this.http.put(
      `http://localhost:8080/api/product/${product._id}`,
      formData
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
