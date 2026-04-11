import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ProductActions,
  selectSelectedProduct,
  selectProductsLoading,
  CartService,
} from '@nx-ecom-app/data-access';
import { ButtonComponent, StarRatingComponent } from '@nx-ecom-app/design-system';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, StarRatingComponent],
  template: `
    <div class="detail-page">
      <a routerLink="/" class="back-link">← Back to Products</a>

      <div *ngIf="loading$ | async" class="loading">Loading product…</div>

      <div *ngIf="product$ | async as product" class="product-layout">
        <div class="product-image-section">
          <img [src]="product.imageUrl" [alt]="product.name" class="product-image" />
        </div>

        <div class="product-info">
          <span class="category-tag">{{ product.category }}</span>
          <h1>{{ product.name }}</h1>
          <ds-star-rating [rating]="product.rating" />
          <p class="description">{{ product.description }}</p>

          <div class="price-section">
            <span class="price">\${{ product.price | number: '1.2-2' }}</span>
            <span *ngIf="!product.inStock" class="out-of-stock">Out of Stock</span>
          </div>

          <div class="actions">
            <ds-button
              variant="primary"
              size="lg"
              [disabled]="!product.inStock"
              (click)="addToCart(product)"
            >
              🛒 Add to Cart
            </ds-button>
            <ds-button variant="ghost" size="lg" routerLink="/cart">View Cart</ds-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-page { max-width: 900px; margin: 0 auto; padding: 2rem; }
    .back-link { color: #6366f1; text-decoration: none; font-weight: 500; }
    .back-link:hover { text-decoration: underline; }

    .loading { text-align: center; padding: 4rem; color: #6b7280; }

    .product-layout {
      display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;
      margin-top: 2rem; align-items: start;
    }
    .product-image { width: 100%; border-radius: 1rem; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }

    .category-tag {
      font-size: 0.8rem; font-weight: 600; color: #6366f1;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    h1 { font-size: 1.875rem; font-weight: 800; margin: 0.5rem 0; }
    .description { color: #4b5563; line-height: 1.7; margin: 1rem 0; }

    .price-section { display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0; }
    .price { font-size: 2rem; font-weight: 800; color: #111827; }
    .out-of-stock { background: #fee2e2; color: #ef4444; padding: 0.25rem 0.75rem;
      border-radius: 9999px; font-size: 0.875rem; font-weight: 600; }

    .actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  `],
})
export class ProductDetailPageComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);

  product$ = this.store.select(selectSelectedProduct);
  loading$ = this.store.select(selectProductsLoading);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.store.dispatch(ProductActions.loadProduct({ id }));
  }

  addToCart(product: any): void {
    this.cartService.addItem(product);
  }
}
