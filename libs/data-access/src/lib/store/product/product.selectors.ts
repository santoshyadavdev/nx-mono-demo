import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, ProductState } from './product.reducer';

export const selectProductState = createFeatureSelector<ProductState>('products');

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectAllProducts = createSelector(selectProductState, selectAll);
export const selectProductEntities = createSelector(selectProductState, selectEntities);
export const selectProductsLoading = createSelector(selectProductState, (s) => s.loading);
export const selectProductsError = createSelector(selectProductState, (s) => s.error);
export const selectSelectedProductId = createSelector(selectProductState, (s) => s.selectedId);
export const selectCategoryFilter = createSelector(selectProductState, (s) => s.categoryFilter);

export const selectSelectedProduct = createSelector(
  selectProductEntities,
  selectSelectedProductId,
  (entities, id) => (id ? entities[id] : null)
);

export const selectFilteredProducts = createSelector(
  selectAllProducts,
  selectCategoryFilter,
  (products, category) =>
    category ? products.filter((p) => p.category === category) : products
);

export const selectCategories = createSelector(selectAllProducts, (products) =>
  [...new Set(products.map((p) => p.category))]
);
