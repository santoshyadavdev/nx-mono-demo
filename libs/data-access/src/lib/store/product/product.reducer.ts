import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { ProductActions } from './product.actions';

export interface ProductState extends EntityState<Product> {
  selectedId: string | null;
  categoryFilter: string | null;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

const initialState: ProductState = adapter.getInitialState({
  selectedId: null,
  categoryFilter: null,
  loading: false,
  error: null,
});

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, (state) => ({ ...state, loading: true, error: null })),
  on(ProductActions.loadProductsSuccess, (state, { products }) =>
    adapter.setAll(products, { ...state, loading: false })
  ),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProductActions.loadProduct, (state, { id }) => ({
    ...state,
    selectedId: id,
    loading: true,
  })),
  on(ProductActions.loadProductSuccess, (state, { product }) =>
    adapter.upsertOne(product, { ...state, loading: false })
  ),
  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProductActions.setCategoryFilter, (state, { category }) => ({
    ...state,
    categoryFilter: category,
  }))
);
