import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartActions } from '../store/cart/cart.actions';
import {
  selectCartEmpty,
  selectCartItemCount,
  selectCartItems,
  selectCartTotal,
} from '../store/cart/cart.selectors';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private store = inject(Store);

  items$ = this.store.select(selectCartItems);
  count$ = this.store.select(selectCartItemCount);
  total$ = this.store.select(selectCartTotal);
  empty$ = this.store.select(selectCartEmpty);

  loadCart(): void {
    this.store.dispatch(CartActions.loadCart());
  }

  addItem(product: Product, quantity = 1): void {
    // Optimistic local update + API sync
    this.store.dispatch(CartActions.addItem({ product, quantity }));
    this.store.dispatch(CartActions.apiAddItem({ productId: product.id, quantity }));
  }

  removeItem(productId: string, itemId?: string): void {
    this.store.dispatch(CartActions.removeItem({ productId }));
    if (itemId) {
      this.store.dispatch(CartActions.apiRemoveItem({ itemId }));
    }
  }

  updateQuantity(productId: string, quantity: number, itemId?: string): void {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
    if (itemId) {
      this.store.dispatch(CartActions.apiUpdateItem({ itemId, quantity }));
    }
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
    this.store.dispatch(CartActions.apiClearCart());
  }
}

