import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiCartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    inStock: boolean;
    rating: number;
  };
  quantity: number;
  subtotal: number;
}

export interface ApiCart {
  id: string;
  sessionId: string;
  items: ApiCartItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ApiCartService {
  private http = inject(HttpClient);
  private base = '/api/cart';

  getCart(): Observable<ApiCart> {
    return this.http.get<ApiCart>(this.base, { withCredentials: true });
  }

  addItem(productId: string, quantity = 1): Observable<ApiCart> {
    return this.http.post<ApiCart>(
      `${this.base}/items`,
      { productId, quantity },
      { withCredentials: true }
    );
  }

  updateItem(itemId: string, quantity: number): Observable<ApiCart> {
    return this.http.put<ApiCart>(
      `${this.base}/items/${itemId}`,
      { quantity },
      { withCredentials: true }
    );
  }

  removeItem(itemId: string): Observable<ApiCart> {
    return this.http.delete<ApiCart>(`${this.base}/items/${itemId}`, {
      withCredentials: true,
    });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.base, { withCredentials: true });
  }
}
