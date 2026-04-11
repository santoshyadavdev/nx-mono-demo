import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '../../models/product.model';

export const ProductActions = createActionGroup({
  source: 'Product',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),
    'Load Product': props<{ id: string }>(),
    'Load Product Success': props<{ product: Product }>(),
    'Load Product Failure': props<{ error: string }>(),
    'Set Category Filter': props<{ category: string | null }>(),
  },
});
