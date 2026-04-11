import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'ds-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span *ngIf="count > 0" [class]="'badge badge-' + color">
      {{ count > 99 ? '99+' : count }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.25rem;
      height: 1.25rem;
      padding: 0 0.35rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 700;
      line-height: 1;
    }
    .badge-primary { background: #6366f1; color: #fff; }
    .badge-success { background: #22c55e; color: #fff; }
    .badge-warning { background: #f59e0b; color: #fff; }
    .badge-danger  { background: #ef4444; color: #fff; }
    .badge-neutral { background: #6b7280; color: #fff; }
  `],
})
export class BadgeComponent {
  @Input() count = 0;
  @Input() color: BadgeColor = 'primary';
}
