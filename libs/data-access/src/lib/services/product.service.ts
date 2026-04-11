import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = '/api/products';

  getProducts(category?: string): Observable<Product[]> {
    const params = category ? new HttpParams().set('category', category) : undefined;
    return this.http.get<Product[]>(this.base, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
}

