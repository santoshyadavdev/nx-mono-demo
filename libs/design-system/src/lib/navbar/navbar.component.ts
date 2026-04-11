import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'ds-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="brand">
        <span class="brand-icon">🛍️</span>
        <span class="brand-name">NxShop</span>
      </a>

      <ul class="nav-links">
        <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a></li>
        <li><a routerLink="/products" routerLinkActive="active">Products</a></li>
      </ul>

      <a routerLink="/cart" class="cart-link" aria-label="Shopping cart">
        <span class="cart-icon">🛒</span>
        <ds-badge [count]="cartCount" color="primary" />
      </a>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      padding: 0 2rem;
      height: 64px;
      background: #fff;
      box-shadow: 0 1px 0 #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex; align-items: center; gap: 0.5rem;
      text-decoration: none; font-weight: 800; font-size: 1.25rem; color: #111827;
    }
    .brand-name { color: #6366f1; }

    .nav-links {
      display: flex; list-style: none; margin: 0 auto; padding: 0; gap: 2rem;
    }
    .nav-links a {
      text-decoration: none; color: #6b7280; font-weight: 500;
      padding: 0.25rem 0; border-bottom: 2px solid transparent; transition: all 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #6366f1; border-bottom-color: #6366f1;
    }

    .cart-link {
      position: relative; display: flex; align-items: center;
      text-decoration: none; font-size: 1.5rem;
    }
    ds-badge { position: absolute; top: -6px; right: -10px; }
  `],
})
export class NavbarComponent {
  @Input() cartCount = 0;
}
