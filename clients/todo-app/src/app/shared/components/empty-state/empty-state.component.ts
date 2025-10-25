import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div class="w-24 h-24 mb-6 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-gray-500 text-center mb-6 max-w-md">{{ message }}</p>
      @if (actionLabel && actionRoute) {
        <a
          [routerLink]="actionRoute"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <lucide-icon [img]="Plus" [size]="18" [strokeWidth]="2"></lucide-icon>
          {{ actionLabel }}
        </a>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = 'No items found';
  @Input() message = 'Get started by creating a new item';
  @Input() actionLabel = '';
  @Input() actionRoute = '';

  readonly Plus = Plus;
}
