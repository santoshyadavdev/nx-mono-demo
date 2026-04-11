import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartState, (s) => s.items);

export const selectCartItemCount = createSelector(selectCartItems, (items) =>
  items.reduce((acc, i) => acc + i.quantity, 0)
);

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
);

export const selectCartEmpty = createSelector(
  selectCartItems,
  (items) => items.length === 0
);
