import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/products`;

  listPublic(category?: string): Observable<Product[]> {
    const params = category ? { params: { category } } : {};
    return this.http.get<Product[]>(`${this.base}/public`, params);
  }

  getPublic(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/public/${id}`);
  }

  listMine(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/mine`);
  }

  create(request: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.base, request);
  }

  update(id: number, request: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
