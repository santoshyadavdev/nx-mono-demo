import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '@nx-ecom-app/data-access';
import { ButtonComponent } from '../button/button.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'ds-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, StarRatingComponent],
  template: `
    <article class="card" [class.out-of-stock]="!product.inStock">
      <a [routerLink]="['/products', product.id]" class="card-image-link">
        <img [src]="product.imageUrl" [alt]="product.name" class="card-image" loading="lazy" />
        <span *ngIf="!product.inStock" class="out-of-stock-label">Out of Stock</span>
      </a>

      <div class="card-body">
        <span class="category-tag">{{ product.category }}</span>
        <h3 class="card-title">
          <a [routerLink]="['/products', product.id]">{{ product.name }}</a>
        </h3>
        <p class="card-description">{{ product.description }}</p>
        <ds-star-rating [rating]="product.rating" />
      </div>

      <div class="card-footer">
        <span class="price">\${{ product.price | number: '1.2-2' }}</span>
        <ds-button
          variant="primary"
          size="sm"
          [disabled]="!product.inStock"
          (click)="addToCart.emit(product)"
        >
          Add to Cart
        </ds-button>
      </div>
    </article>
  `,
  styles: [`
    .card {
      display: flex;
      flex-direction: column;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      background: #fff;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
    .card.out-of-stock { opacity: 0.75; }

    .card-image-link { position: relative; display: block; }
    .card-image { width: 100%; height: 200px; object-fit: cover; display: block; }
    .out-of-stock-label {
      position: absolute; top: 0.5rem; right: 0.5rem;
      background: #ef4444; color: #fff;
      padding: 0.2rem 0.6rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700;
    }

    .card-body { flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .category-tag {
      font-size: 0.75rem; font-weight: 600; color: #6366f1;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .card-title { margin: 0; font-size: 1rem; font-weight: 700; }
    .card-title a { color: #111827; text-decoration: none; }
    .card-title a:hover { color: #6366f1; }
    .card-description { margin: 0; font-size: 0.875rem; color: #6b7280; line-height: 1.4;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

    .card-footer {
      padding: 0.75rem 1rem;
      display: flex; align-items: center; justify-content: space-between;
      border-top: 1px solid #f3f4f6;
    }
    .price { font-size: 1.25rem; font-weight: 800; color: #111827; }
  `],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
}
