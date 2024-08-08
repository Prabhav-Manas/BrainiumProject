import { NgModule } from '@angular/core';
import { CategoryListComponent } from './category-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CategoryListComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CategoryModule {}
