import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Product } from 'src/app/appModels/product-data.model';
import { ProductService } from 'src/app/appServices/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  updateProductForm: any = FormGroup;
  products: Product[] = [];
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  editingProduct: Product | null = null;
  selectedFile: File | null = null;

  constructor(
    private _productService: ProductService,
    private fb: FormBuilder
  ) {
    this.updateProductForm = this.fb.group({
      category: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      closeDate: new FormControl('', [Validators.required]),
      discount: new FormControl('', [Validators.required]),
      image: [''],
    });
  }

  ngOnInit(): void {
    this.fetchProducts(this.productsPerPage, this.currentPage);
  }

  fetchProducts(postsPerPage: number, currentPage: number): void {
    this._productService.getProducts(postsPerPage, currentPage).subscribe(
      (data) => {
        console.log('Product-List-Data:=>', data);
        this.products = data.products.map((product) => ({
          ...product,
          mainImage: this.getImageUrl(product.imagePath), // Use the first image as mainImage
        })) as Product[];
      },
      (error) => {
        console.log('Error fetching products', error);
      }
    );
  }

  onPageChanged(pageData: { pageIndex: number; pageSize: number }) {
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.fetchProducts(this.productsPerPage, this.currentPage);
  }

  onEditProduct(product: Product) {
    console.log('Editing product:', product); // Ensure the product data is correct

    console.log('Editing product ID:', product._id); // Check if the product ID is defined

    // Parse and format dates safely
    const startDate = this.formatDate(product.startDate);
    const closeDate = this.formatDate(product.closeDate);

    this.editingProduct = product;
    this.updateProductForm.patchValue({
      category: product.category,
      productName: product.productName,
      description: product.description,
      price: product.price,
      startDate: startDate,
      closeDate: closeDate,
      discount: product.discount,
    });

    console.log(
      'Editing product ID (after patchValue):',
      this.editingProduct._id
    ); // Double-check the ID after patching form values
  }

  formatDate(date: string | Date): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime())
      ? parsedDate.toISOString().split('T')[0]
      : '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpdateProduct() {
    if (this.updateProductForm.invalid || !this.editingProduct) {
      return;
    }

    const updatedProduct = {
      ...this.editingProduct,
      ...this.updateProductForm.value,
    };

    console.log('Updating product with ID:', updatedProduct._id); // Check the product ID before sending the request

    this._productService
      .updateProduct(updatedProduct, this.selectedFile || undefined)
      .subscribe(
        () => {
          this.fetchProducts(this.productsPerPage, this.currentPage);
          this.editingProduct = null;
          this.updateProductForm.reset();
          this.selectedFile = null;
        },
        (error) => {
          console.log('Error updating product', error);
        }
      );
  }

  onDeleteProduct(product: Product) {
    this._productService.deleteProduct(product).subscribe(
      (res) => {
        this.fetchProducts(this.productsPerPage, this.currentPage);
        alert('Product Deleted Successfully!');
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getImageUrl(filename: string): string {
    return `http://localhost:8080/api/images/${filename}`;
  }
}
