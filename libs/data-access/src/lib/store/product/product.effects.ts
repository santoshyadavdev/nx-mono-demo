import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ProductActions } from './product.actions';

export const loadProducts$ = createEffect(
  (actions$ = inject(Actions), productService = inject(ProductService)) =>
    actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        productService.getProducts().pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) =>
            of(ProductActions.loadProductsFailure({ error: error.message }))
          )
        )
      )
    ),
  { functional: true }
);

export const loadProduct$ = createEffect(
  (actions$ = inject(Actions), productService = inject(ProductService)) =>
    actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap(({ id }) =>
        productService.getProduct(id).pipe(
          map((product) => ProductActions.loadProductSuccess({ product })),
          catchError((error) =>
            of(ProductActions.loadProductFailure({ error: error.message }))
          )
        )
      )
    ),
  { functional: true }
);
