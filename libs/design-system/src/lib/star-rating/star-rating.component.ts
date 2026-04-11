import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stars" [attr.aria-label]="rating + ' out of 5 stars'">
      <span *ngFor="let star of stars" [class]="getStarClass(star)">★</span>
      <span class="rating-text">{{ rating | number: '1.1-1' }}</span>
    </div>
  `,
  styles: [`
    .stars { display: inline-flex; align-items: center; gap: 2px; }
    span   { font-size: 1rem; }
    .star-full  { color: #f59e0b; }
    .star-half  { color: #f59e0b; opacity: 0.6; }
    .star-empty { color: #d1d5db; }
    .rating-text { font-size: 0.8rem; color: #6b7280; margin-left: 4px; }
  `],
})
export class StarRatingComponent {
  @Input() rating = 0;

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getStarClass(star: number): string {
    if (star <= Math.floor(this.rating)) return 'star-full';
    if (star === Math.ceil(this.rating) && this.rating % 1 >= 0.5) return 'star-half';
    return 'star-empty';
  }
}
