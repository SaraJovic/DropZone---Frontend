import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data);
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}