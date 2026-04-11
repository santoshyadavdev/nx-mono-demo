import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ApiCartService } from '../../services/api-cart.service';
import { CartActions } from './cart.actions';

export const loadCart$ = createEffect(
  (actions$ = inject(Actions), apiCart = inject(ApiCartService)) =>
    actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        apiCart.getCart().pipe(
          map((cart) => CartActions.loadCartSuccess({ cart })),
          catchError((e) => of(CartActions.loadCartFailure({ error: e.message })))
        )
      )
    ),
  { functional: true }
);

export const apiAddItem$ = createEffect(
  (actions$ = inject(Actions), apiCart = inject(ApiCartService)) =>
    actions$.pipe(
      ofType(CartActions.apiAddItem),
      switchMap(({ productId, quantity }) =>
        apiCart.addItem(productId, quantity).pipe(
          map((cart) => CartActions.apiAddItemSuccess({ cart })),
          catchError((e) => of(CartActions.apiError({ error: e.message })))
        )
      )
    ),
  { functional: true }
);

export const apiRemoveItem$ = createEffect(
  (actions$ = inject(Actions), apiCart = inject(ApiCartService)) =>
    actions$.pipe(
      ofType(CartActions.apiRemoveItem),
      switchMap(({ itemId }) =>
        apiCart.removeItem(itemId).pipe(
          map((cart) => CartActions.apiRemoveItemSuccess({ cart })),
          catchError((e) => of(CartActions.apiError({ error: e.message })))
        )
      )
    ),
  { functional: true }
);

export const apiUpdateItem$ = createEffect(
  (actions$ = inject(Actions), apiCart = inject(ApiCartService)) =>
    actions$.pipe(
      ofType(CartActions.apiUpdateItem),
      switchMap(({ itemId, quantity }) =>
        apiCart.updateItem(itemId, quantity).pipe(
          map((cart) => CartActions.apiUpdateItemSuccess({ cart })),
          catchError((e) => of(CartActions.apiError({ error: e.message })))
        )
      )
    ),
  { functional: true }
);

export const apiClearCart$ = createEffect(
  (actions$ = inject(Actions), apiCart = inject(ApiCartService)) =>
    actions$.pipe(
      ofType(CartActions.apiClearCart),
      switchMap(() =>
        apiCart.clearCart().pipe(
          map(() => CartActions.apiClearCartSuccess()),
          catchError((e) => of(CartActions.apiError({ error: e.message })))
        )
      )
    ),
  { functional: true }
);
