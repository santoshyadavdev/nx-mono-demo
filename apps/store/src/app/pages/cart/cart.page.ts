import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '@nx-ecom-app/data-access';
import { ButtonComponent } from '@nx-ecom-app/design-system';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="cart-page">
      <h1>Shopping Cart</h1>

      <div *ngIf="cartService.empty$ | async" class="empty-cart">
        <p>🛒 Your cart is empty</p>
        <ds-button variant="primary" routerLink="/">Continue Shopping</ds-button>
      </div>

      <div *ngIf="!(cartService.empty$ | async)" class="cart-layout">
        <div class="cart-items">
          <div *ngFor="let item of cartService.items$ | async" class="cart-item">
            <img [src]="item.product.imageUrl" [alt]="item.product.name" class="item-image" />
            <div class="item-details">
              <h3>{{ item.product.name }}</h3>
              <p class="item-price">\${{ item.product.price | number: '1.2-2' }} each</p>
            </div>
            <div class="item-controls">
              <ds-button variant="secondary" size="sm"
                (click)="decrement(item.product.id, item.quantity)">−</ds-button>
              <span class="qty">{{ item.quantity }}</span>
              <ds-button variant="secondary" size="sm"
                (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)">+</ds-button>
            </div>
            <span class="item-total">\${{ item.product.price * item.quantity | number: '1.2-2' }}</span>
            <ds-button variant="danger" size="sm"
              (click)="cartService.removeItem(item.product.id)">✕</ds-button>
          </div>
        </div>

        <aside class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Items ({{ cartService.count$ | async }})</span>
            <span>\${{ cartService.total$ | async | number: '1.2-2' }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span class="free">Free</span>
          </div>
          <hr />
          <div class="summary-row total">
            <strong>Total</strong>
            <strong>\${{ cartService.total$ | async | number: '1.2-2' }}</strong>
          </div>
          <ds-button variant="primary" size="lg" style="width:100%; margin-top:1rem">
            Checkout
          </ds-button>
          <ds-button variant="ghost" size="sm" (click)="cartService.clearCart()"
            style="width:100%; margin-top:0.5rem">
            Clear Cart
          </ds-button>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { max-width: 1100px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 2rem; }

    .empty-cart { text-align: center; padding: 4rem; color: #6b7280; }
    .empty-cart p { font-size: 1.5rem; margin-bottom: 1.5rem; }

    .cart-layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }

    .cart-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem; border-bottom: 1px solid #f3f4f6;
    }
    .item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 0.5rem; }
    .item-details { flex: 1; }
    .item-details h3 { margin: 0 0 0.25rem; font-size: 1rem; }
    .item-price { margin: 0; color: #6b7280; font-size: 0.875rem; }
    .item-controls { display: flex; align-items: center; gap: 0.5rem; }
    .qty { min-width: 2rem; text-align: center; font-weight: 700; }
    .item-total { font-weight: 700; min-width: 5rem; text-align: right; }

    .order-summary {
      background: #f9fafb; border-radius: 0.75rem;
      padding: 1.5rem; position: sticky; top: 80px;
    }
    .order-summary h2 { margin: 0 0 1rem; }
    .summary-row { display: flex; justify-content: space-between; padding: 0.5rem 0; }
    .free { color: #22c55e; font-weight: 600; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 0.5rem 0; }
    .total { font-size: 1.125rem; }
  `],
})
export class CartPageComponent {
  cartService = inject(CartService);

  decrement(productId: string, currentQty: number): void {
    if (currentQty <= 1) {
      this.cartService.removeItem(productId);
    } else {
      this.cartService.updateQuantity(productId, currentQty - 1);
    }
  }
}
