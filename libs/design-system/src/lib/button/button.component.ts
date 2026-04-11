import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [type]="type"
    >
      <span *ngIf="loading" class="spinner"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    button:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-sm  { padding: 0.375rem 0.75rem;  font-size: 0.875rem; }
    .btn-md  { padding: 0.625rem 1.25rem;  font-size: 1rem; }
    .btn-lg  { padding: 0.75rem 1.5rem;    font-size: 1.125rem; }

    .btn-primary   { background: #6366f1; color: #fff; }
    .btn-primary:hover:not(:disabled)   { background: #4f46e5; }

    .btn-secondary { background: #e5e7eb; color: #111827; }
    .btn-secondary:hover:not(:disabled) { background: #d1d5db; }

    .btn-danger    { background: #ef4444; color: #fff; }
    .btn-danger:hover:not(:disabled)    { background: #dc2626; }

    .btn-ghost     { background: transparent; color: #6366f1; border: 2px solid #6366f1; }
    .btn-ghost:hover:not(:disabled)     { background: #eef2ff; }

    .spinner {
      width: 1em; height: 1em;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  get buttonClasses(): string {
    return `btn-${this.variant} btn-${this.size}`;
  }
}
