import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { ProductService } from 'src/app/appServices/product.service';
import { mimeType } from './mime-type.validator';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { CategoryService } from 'src/app/appServices/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  sellerAddProductModalForm: any = FormGroup;
  imagePreviews: string[] = [];
  categoryTypeOptions: { value: string; label: string }[] = [];

  @ViewChild('filePicker')
  filePicker!: ElementRef<HTMLInputElement>;

  // categoryTypeOptions = [
  //   { value: 'Select', label: 'Select' },
  //   { value: 'mobile', label: 'Mobile' },
  //   { value: 'laptop', label: 'Laptop' },
  // ];

  discountOptions = [
    { value: 'Select', label: 'Select' },
    { value: '5%', label: '5%' },
    { value: '10%', label: '10%' },
    { value: '20%', label: '20%' },
  ];

  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private ng2ImgMax: Ng2ImgMaxService,
    private _categoryService: CategoryService
  ) {
    this.sellerAddProductModalForm = this.fb.group({
      category: new FormControl('Select', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      closeDate: new FormControl('', [Validators.required]),
      discount: new FormControl('5%', [Validators.required]),
      images: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.updateCategoryOptions();
  }

  // fetchCategoriesForDropDown() {
  //   this._categoryService.getCategories().subscribe(
  //     (data: any[]) => {
  //       this.categoryTypeOptions = data.map((category) => ({
  //         value: category.name,
  //         label: category.name,
  //       }));
  //     },
  //     (error) => {
  //       console.log('Error in fetching categories', error);
  //     }
  //   );
  // }

  updateCategoryOptions(): void {
    // Fetch categories from CategoryService and update categoryTypeOptions
    this._categoryService.getCategories().subscribe(
      (categories: any[]) => {
        this.categoryTypeOptions = [
          { value: 'Select', label: 'Select' },
          ...categories.map((category) => ({
            value: category._id,
            label: category.name,
          })),
        ];
      },
      (error) => {
        console.log('Error fetching categories', error);
      }
    );
  }

  onImagesPicked(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files); // Convert FileList to array

      // Clear previous image previews
      this.imagePreviews = [];
      const imagesArray = this.sellerAddProductModalForm.get(
        'images'
      ) as FormArray;
      imagesArray.clear();

      // Check file size (in bytes) and resize (if needed) and preview images
      files.forEach((file) => {
        // Check file size (in bytes)
        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSize) {
          alert('File size exceeds the limit of 5MB.');
          return;
        }

        // Optionally resize the image if needed
        this.ng2ImgMax.resizeImage(file, 100, 100).subscribe(
          (result) => {
            // Resize successful, result is a Blob
            const resizedFile = new File([result], file.name);

            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                this.imagePreviews.push(reader.result); // Push the image preview URL
              } else {
                console.log('FileReader result is not a string');
              }
            };
            reader.readAsDataURL(resizedFile);

            // Update the form control array 'images'
            const imagesArray = this.sellerAddProductModalForm.get(
              'images'
            ) as FormArray;
            imagesArray.push(this.fb.control(resizedFile)); // Push the file as a FormControl into the FormArray
          },
          (error) => {
            // Handle errors
            console.error('Error resizing image:', error);
          }
        );
      });

      // Clear the file input to allow selecting another set of images
      input.value = '';
    }
  }

  onSubmitAddProduct() {
    if (this.sellerAddProductModalForm.valid) {
      const category = this.sellerAddProductModalForm.value.category;
      const productName = this.sellerAddProductModalForm.value.productName;
      const description = this.sellerAddProductModalForm.value.description;
      const price = this.sellerAddProductModalForm.value.price;
      const startDate = this.sellerAddProductModalForm.value.startDate;
      const closeDate = this.sellerAddProductModalForm.value.closeDate;
      const discount = this.sellerAddProductModalForm.value.discount;
      const images = this.sellerAddProductModalForm.value.images;

      this._productService
        .addProduct(
          category,
          productName,
          description,
          price,
          startDate,
          closeDate,
          discount,
          images
        )
        .subscribe(
          (res) => {
            alert('Product added successfully.');
            this.sellerAddProductModalForm.reset();
            this.imagePreviews = [];
            this.filePicker.nativeElement.value = '';
          },
          (error) => {
            if (
              error.status === 400 &&
              error.error.message === 'Invalid mime type'
            ) {
              alert('Invalid mime type. Please upload a valid image file.');
            } else {
              alert('An error occurred while uploading the image.');
            }
          }
        );
    }
    console.log(this.sellerAddProductModalForm.value);
  }
}
