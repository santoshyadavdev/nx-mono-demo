import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  ProductActions,
  selectFilteredProducts,
  selectProductsLoading,
  selectCategories,
  selectCategoryFilter,
  CartService,
  Product,
} from '@nx-ecom-app/data-access';
import { ProductCardComponent, ButtonComponent } from '@nx-ecom-app/design-system';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ButtonComponent],
  template: `
    <div class="home-page">
      <section class="hero">
        <h1>Welcome to <span class="highlight">NxShop</span></h1>
        <p>Discover amazing products at unbeatable prices</p>
      </section>

      <div class="toolbar">
        <div class="category-filters">
          <ds-button
            [variant]="(categoryFilter$ | async) === null ? 'primary' : 'secondary'"
            size="sm"
            (click)="setCategory(null)"
          >All</ds-button>
          <ds-button
            *ngFor="let cat of categories$ | async"
            [variant]="(categoryFilter$ | async) === cat ? 'primary' : 'secondary'"
            size="sm"
            (click)="setCategory(cat)"
          >{{ cat }}</ds-button>
        </div>
      </div>

      <div *ngIf="loading$ | async" class="loading">Loading products…</div>

      <div class="product-grid">
        <ds-product-card
          *ngFor="let product of products$ | async"
          [product]="product"
          (addToCart)="onAddToCart($event)"
        />
      </div>
    </div>
  `,
  styles: [`
    .home-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }

    .hero { text-align: center; padding: 3rem 1rem; }
    .hero h1 { font-size: 2.5rem; font-weight: 800; margin: 0 0 0.5rem; }
    .hero p  { color: #6b7280; font-size: 1.125rem; }
    .highlight { color: #6366f1; }

    .toolbar { display: flex; justify-content: center; margin-bottom: 2rem; }
    .category-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }

    .loading { text-align: center; padding: 4rem; color: #6b7280; font-size: 1.125rem; }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }
  `],
})
export class HomePageComponent implements OnInit {
  private store = inject(Store);
  private cartService = inject(CartService);

  products$ = this.store.select(selectFilteredProducts);
  loading$  = this.store.select(selectProductsLoading);
  categories$ = this.store.select(selectCategories);
  categoryFilter$ = this.store.select(selectCategoryFilter);

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadProducts());
    this.cartService.loadCart();
  }

  setCategory(category: string | null): void {
    this.store.dispatch(ProductActions.setCategoryFilter({ category }));
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem(product);
  }
}
