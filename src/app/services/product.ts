import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductPage, ProductVariant, NewProduct } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(page: number = 0, size: number = 12, sort?: string): Observable<ProductPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<ProductPage>(this.apiUrl, { params });
}

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  searchProducts(name: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }

  filterProducts(categoryId?: number, gender?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (categoryId != null) params = params.set('categoryId', categoryId.toString());
    if (gender != null)     params = params.set('gender', gender);
    return this.http.get<Product[]>(`${this.apiUrl}/filter`, { params });
  }

  createProduct(data: NewProduct): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  updateProduct(id: number, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addVariant(productId: number, data: Partial<ProductVariant>): Observable<ProductVariant> {
    return this.http.post<ProductVariant>(`${this.apiUrl}/${productId}/variants`, data);
  }

  addImage(productId: number, imageUrl: string, isPrimary: boolean): Observable<any> {
    const params = new HttpParams()
      .set('imageUrl', imageUrl)
      .set('isPrimary', isPrimary.toString());
    return this.http.post<any>(`${this.apiUrl}/${productId}/images`, {}, { params });
  }
}