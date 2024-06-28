import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../appModels/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<Category[]>(
      'http://localhost:8080/api/category/all-categories'
    );
  }

  addCategory(name: string) {
    return this.http.post<Category>(
      'http://localhost:8080/api/category/add-category',
      {
        name,
      }
    );
  }

  updateCategory(id: string, name: string) {
    return this.http.put<Category>(`http://localhost:8080/api/category/${id}`, {
      name,
    });
  }

  deleteCategory(id: string) {
    return this.http.delete(`http://localhost:8080/api/category/${id}`);
  }
}
