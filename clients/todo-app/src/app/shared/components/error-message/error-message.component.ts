import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
      <p class="font-medium">{{ message || 'An error occurred' }}</p>
    </div>
  `,
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
}
