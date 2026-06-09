import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CheckoutApiService, CheckoutRequest } from '@nx-ecom-app/data-access';
import { ButtonComponent } from '@nx-ecom-app/design-system';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="checkout-page">
      <h1>Checkout</h1>

      <form [formGroup]="form" (ngSubmit)="submit()" class="checkout-form">
        <h2>Shipping Address</h2>

        <div class="field">
          <label for="name">Full Name</label>
          <input id="name" formControlName="name" placeholder="Jane Doe" />
          <span class="error" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
            Name is required.
          </span>
        </div>

        <div class="field">
          <label for="address">Street Address</label>
          <input id="address" formControlName="address" placeholder="123 Main St" />
          <span class="error" *ngIf="form.get('address')?.invalid && form.get('address')?.touched">
            Address is required.
          </span>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="city">City</label>
            <input id="city" formControlName="city" placeholder="Springfield" />
            <span class="error" *ngIf="form.get('city')?.invalid && form.get('city')?.touched">
              City is required.
            </span>
          </div>
          <div class="field">
            <label for="zip">ZIP Code</label>
            <input id="zip" formControlName="zip" placeholder="12345" />
            <span class="error" *ngIf="form.get('zip')?.invalid && form.get('zip')?.touched">
              ZIP is required.
            </span>
          </div>
        </div>

        <div class="error-banner" *ngIf="errorMessage()">
          {{ errorMessage() }}
        </div>

        <div class="actions">
          <ds-button variant="ghost" type="button" routerLink="/cart">Back to Cart</ds-button>
          <ds-button
            variant="primary"
            size="lg"
            type="submit"
            [disabled]="form.invalid || loading()">
            {{ loading() ? 'Processing...' : 'Place Order' }}
          </ds-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .checkout-page { max-width: 600px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 2rem; }
    h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; }
    .checkout-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .field { display: flex; flex-direction: column; gap: 0.25rem; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { font-weight: 600; font-size: 0.875rem; }
    input {
      padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem;
      font-size: 1rem; outline: none;
    }
    input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
    .error { color: #ef4444; font-size: 0.8rem; }
    .error-banner {
      background: #fee2e2; color: #b91c1c; padding: 0.75rem 1rem;
      border-radius: 0.5rem; font-size: 0.9rem;
    }
    .actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 0.5rem; }
  `],
})
export class CheckoutPageComponent {
  private fb = inject(FormBuilder);
  private checkoutService = inject(CheckoutApiService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
  });

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const request = this.form.value as CheckoutRequest;
    this.checkoutService.placeOrder(request).subscribe({
      next: (order) => {
        this.loading.set(false);
        this.router.navigate(['/order-confirmation'], { state: { order } });
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.error;
        if (err.status === 400) {
          this.errorMessage.set(msg ?? 'Your cart is empty. Please add items before checking out.');
        } else if (err.status === 402) {
          this.errorMessage.set('Payment failed. Please try again.');
        } else {
          this.errorMessage.set('Something went wrong. Please try again.');
        }
      },
    });
  }
}
