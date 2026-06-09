import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderResponse } from '@nx-ecom-app/data-access';
import { ButtonComponent } from '@nx-ecom-app/design-system';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="confirmation-page">
      <div *ngIf="order(); else noOrder" class="confirmation-card">
        <div class="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p class="order-id">Order ID: <strong>{{ order()!.id }}</strong></p>
        <span class="badge">{{ order()!.status }}</span>

        <div class="section">
          <h2>Shipping To</h2>
          <p>{{ order()!.shippingName }}</p>
          <p>{{ order()!.shippingAddress }}</p>
          <p>{{ order()!.shippingCity }}, {{ order()!.shippingZip }}</p>
        </div>

        <div class="section">
          <h2>Items</h2>
          <div class="item-row" *ngFor="let item of order()!.items">
            <span>{{ item.productName }} × {{ item.quantity }}</span>
            <span>\${{ item.subtotal | number: '1.2-2' }}</span>
          </div>
          <div class="item-row total-row">
            <strong>Total</strong>
            <strong>\${{ order()!.total | number: '1.2-2' }}</strong>
          </div>
        </div>

        <ds-button variant="primary" size="lg" routerLink="/" style="margin-top:1rem">
          Continue Shopping
        </ds-button>
      </div>

      <ng-template #noOrder>
        <div class="no-order">
          <p>No order found.</p>
          <ds-button variant="primary" routerLink="/">Go to Home</ds-button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .confirmation-page { max-width: 600px; margin: 0 auto; padding: 2rem; }
    .confirmation-card { text-align: center; }
    .success-icon {
      width: 4rem; height: 4rem; border-radius: 50%;
      background: #d1fae5; color: #065f46;
      font-size: 2rem; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
    }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
    .order-id { color: #6b7280; font-size: 0.9rem; margin-bottom: 0.5rem; }
    .badge {
      display: inline-block; padding: 0.25rem 0.75rem;
      background: #d1fae5; color: #065f46;
      border-radius: 9999px; font-size: 0.8rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .section { text-align: left; margin-top: 2rem; }
    .section h2 { font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.5rem; }
    .section p { margin: 0.2rem 0; color: #374151; }
    .item-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f9fafb; }
    .total-row { border-top: 2px solid #e5e7eb; margin-top: 0.5rem; padding-top: 0.75rem; }
    .no-order { text-align: center; padding: 4rem; color: #6b7280; }
  `],
})
export class OrderConfirmationPageComponent implements OnInit {
  order = signal<OrderResponse | null>(null);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { order: OrderResponse } | undefined;
    if (state?.order) {
      this.order.set(state.order);
    } else {
      // Re-read from history.state if navigation has already completed
      const histState = history.state as { order?: OrderResponse };
      if (histState?.order) {
        this.order.set(histState.order);
      }
    }
  }
}
