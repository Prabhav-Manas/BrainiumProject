import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Category } from 'src/app/appModels/category.model';
import { CategoryApiResponse } from 'src/app/appModels/categoryAPIResponse';
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
  categoryTypeOptions: { value: string; label: string }[] = [];

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
      (categories: Category[]) => {
        this.categories = categories;
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
        (response: Category) => {
          this.categories.push({ _id: response._id, name }); // Push new category to local array
          this.updateCategoryOptions(); // Update dropdown options after adding category
          this.categoryForm.reset(); // Reset form after successful addition
        },
        (error) => {
          console.log('Error adding category', error);
        }
      );
    }
  }

  updateCategoryOptions(): void {
    // Update categoryTypeOptions with current categories
    this.categoryTypeOptions = [
      { value: 'Select', label: 'Select' },
      ...this.categories.map((category) => ({
        value: category._id,
        label: category.name,
      })),
    ];
  }

  onStartEditCategory(category: any): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({ name: category.name });
  }

  onEditCategory(): void {
    if (
      this.categoryForm.valid &&
      this.editingCategory &&
      this.editingCategory._id
    ) {
      const name = this.categoryForm.value.name;

      this._categoryService
        .updateCategory(this.editingCategory._id, name)
        .subscribe(
          (updatedCategory: any) => {
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
        this.categories = this.categories.filter(
          (cat) => cat._id !== categoryId
        ); // Optionally, update the dropdown in add-product component

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
