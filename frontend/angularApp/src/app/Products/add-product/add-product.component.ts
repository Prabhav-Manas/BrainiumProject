import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ProductService } from 'src/app/appServices/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  sellerAddProductModalForm: any = FormGroup;

  categoryTypeOptions = [
    { value: 'Select', label: 'Select' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'laptop', label: 'Laptop' },
  ];

  discountOptions = [
    { value: 'Select', label: 'Select' },
    { value: '5%', label: '5%' },
    { value: '10%', label: '10%' },
    { value: '20%', label: '20%' },
  ];

  constructor(
    private fb: FormBuilder,
    private _productService: ProductService
  ) {
    this.sellerAddProductModalForm = this.fb.group({
      category: new FormControl('mobile', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      closeDate: new FormControl('', [Validators.required]),
      discount: new FormControl('5%', [Validators.required]),
      // images: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onSubmitAddProduct() {
    if (this.sellerAddProductModalForm.valid) {
      const category = this.sellerAddProductModalForm.value.category;
      const productName = this.sellerAddProductModalForm.value.productName;
      const description = this.sellerAddProductModalForm.value.description;
      const price = this.sellerAddProductModalForm.value.price;
      const startDate = this.sellerAddProductModalForm.value.startDate;
      const closeDate = this.sellerAddProductModalForm.value.closeDate;
      const discount = this.sellerAddProductModalForm.value.discount;

      this._productService
        .addProduct(
          category,
          productName,
          description,
          price,
          startDate,
          closeDate,
          discount
        )
        .subscribe(
          (res) => {
            alert('Product added successfully.');
          },
          (error) => {
            alert('Error adding product.');
            console.log('Error in adding product', error);
          }
        );

      console.log(this.sellerAddProductModalForm.value);
    }
    this.sellerAddProductModalForm.reset();
  }

  onFileSelected(event: Event): void {
    // const input = event.target as HTMLInputElement;
    // if (input.files && input.files.length) {
    //   const files = Array.from(input.files);
    //   this.form.patchValue({
    //     images: files
    //   });
    //   this.form.get('images')!.updateValueAndValidity();
    //   // You can process the selected files here, if needed
    //   console.log(files); // This will log the selected files to the console
    // }
  }
}
