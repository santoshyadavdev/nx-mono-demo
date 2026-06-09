import { CartItem } from './cart.model';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  status: string;
  total: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface CheckoutRequest {
  name: string;
  address: string;
  city: string;
  zip: string;
}
