import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest, OrderResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class CheckoutApiService {
  private http = inject(HttpClient);
  private base = '/api/checkout';

  placeOrder(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.base, request, {
      withCredentials: true,
    });
  }
}
