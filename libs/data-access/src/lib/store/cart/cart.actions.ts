import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { ApiCart } from '../../services/api-cart.service';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    // Local actions
    'Add Item': props<{ product: Product; quantity: number }>(),
    'Remove Item': props<{ productId: string }>(),
    'Update Quantity': props<{ productId: string; quantity: number }>(),
    'Clear Cart': emptyProps(),

    // API actions
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ cart: ApiCart }>(),
    'Load Cart Failure': props<{ error: string }>(),
    'Api Add Item': props<{ productId: string; quantity: number }>(),
    'Api Add Item Success': props<{ cart: ApiCart }>(),
    'Api Remove Item': props<{ itemId: string }>(),
    'Api Remove Item Success': props<{ cart: ApiCart }>(),
    'Api Update Item': props<{ itemId: string; quantity: number }>(),
    'Api Update Item Success': props<{ cart: ApiCart }>(),
    'Api Clear Cart': emptyProps(),
    'Api Clear Cart Success': emptyProps(),
    'Api Error': props<{ error: string }>(),
  },
});

