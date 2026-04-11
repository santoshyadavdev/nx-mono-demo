import { createReducer, on } from '@ngrx/store';
import { CartItem } from '../../models/cart.model';
import { ApiCart } from '../../services/api-cart.service';
import { CartActions } from './cart.actions';

export interface CartState {
  items: CartItem[];
  apiCart: ApiCart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  apiCart: null,
  loading: false,
  error: null,
};

function fromApiCart(apiCart: ApiCart): CartItem[] {
  return apiCart.items.map((i) => ({
    product: {
      id: i.product.id,
      name: i.product.name,
      description: '',
      price: i.product.price,
      imageUrl: i.product.imageUrl,
      category: i.product.category,
      inStock: i.product.inStock,
      rating: i.product.rating,
    },
    quantity: i.quantity,
  }));
}

export const cartReducer = createReducer(
  initialState,

  // Local optimistic actions
  on(CartActions.addItem, (state, { product, quantity }) => {
    const existing = state.items.find((i) => i.product.id === product.id);
    if (existing) {
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      };
    }
    return { ...state, items: [...state.items, { product, quantity }] };
  }),
  on(CartActions.removeItem, (state, { productId }) => ({
    ...state,
    items: state.items.filter((i) => i.product.id !== productId),
  })),
  on(CartActions.updateQuantity, (state, { productId, quantity }) => ({
    ...state,
    items: state.items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    ),
  })),
  on(CartActions.clearCart, () => initialState),

  // API actions
  on(CartActions.loadCart, (state) => ({ ...state, loading: true })),
  on(CartActions.loadCartSuccess, (state, { cart }) => ({
    ...state, loading: false, apiCart: cart, items: fromApiCart(cart),
  })),
  on(CartActions.apiAddItemSuccess, (state, { cart }) => ({
    ...state, apiCart: cart, items: fromApiCart(cart),
  })),
  on(CartActions.apiRemoveItemSuccess, (state, { cart }) => ({
    ...state, apiCart: cart, items: fromApiCart(cart),
  })),
  on(CartActions.apiUpdateItemSuccess, (state, { cart }) => ({
    ...state, apiCart: cart, items: fromApiCart(cart),
  })),
  on(CartActions.apiClearCartSuccess, () => initialState),
  on(CartActions.apiError, CartActions.loadCartFailure, (state, { error }) => ({
    ...state, loading: false, error,
  }))
);

