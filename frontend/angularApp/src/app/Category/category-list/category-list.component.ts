import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Category } from 'src/app/appModels/category.model';
import { CategoryService } from 'src/app/appServices/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: any = FormGroup;
  editingCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private _categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this._categoryService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.log('Error fetching categories', error);
      }
    );
  }

  onAddCategory(): void {
    if (this.categoryForm.valid) {
      const name = this.categoryForm.value.name;
      this._categoryService.addCategory(name).subscribe(
        (data) => {
          this.categories.push({ _id: data._id, name });
          this.categoryForm.reset();
        },
        (error) => {
          console.log('Error adding category', error);
        }
      );
    }
  }

  onStartEditCategory(category: any): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({ name: category.name });
  }

  // onEditCategory(): void {
  //   if (
  //     this.categoryForm.valid &&
  //     this.editingCategory &&
  //     this.editingCategory._id
  //   ) {
  //     const name = this.categoryForm.value.name;
  //     console.log(
  //       'Submitting category update:',
  //       this.editingCategory._id,
  //       name
  //     );

  //     this._categoryService
  //       .updateCategory(this.editingCategory._id, name)
  //       .subscribe(
  //         (response) => {
  //           console.log('Category update response:', response);
  //           if (this.editingCategory) {
  //             this.editingCategory.name = name;
  //           }
  //           this.editingCategory = null;
  //           this.categoryForm.reset();
  //         },
  //         (error) => {
  //           console.log('Error updating category', error);
  //         }
  //       );
  //   } else {
  //     console.log('Form is invalid or editingCategory/_id is missing');
  //   }
  // }

  onEditCategory(): void {
    if (
      this.categoryForm.valid &&
      this.editingCategory &&
      this.editingCategory._id
    ) {
      const name = this.categoryForm.value.name;
      console.log(
        'Submitting category update:',
        this.editingCategory._id,
        name
      );

      this._categoryService
        .updateCategory(this.editingCategory._id, name)
        .subscribe(
          (updatedCategory: any) => {
            // Ensure the parameter type here is Category
            console.log('Category update response:', updatedCategory);
            if (this.editingCategory) {
              this.editingCategory.name = updatedCategory.name;
              this.fetchCategories();
            }
            this.editingCategory = null;
            this.categoryForm.reset();
          },
          (error) => {
            console.error('Error updating category', error);
          }
        );
    } else {
      console.error('Form is invalid or editingCategory/_id is missing');
    }
  }

  onDeleteCategory(categoryId: string | undefined) {
    if (!categoryId) {
      console.log('Category ID is undefined');
      return;
    }
    this._categoryService.deleteCategory(categoryId).subscribe(
      (response) => {
        console.log('Category deleted:', response);
        this.fetchCategories(); // Refresh the list after deletion
      },
      (error) => {
        console.log('Error deleting category:', error);
      }
    );
  }

  onCancelEdit(): void {
    this.editingCategory = null;
    this.categoryForm.reset();
  }
}
