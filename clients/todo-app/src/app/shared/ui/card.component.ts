import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="border-radius: 0.5rem; border: 1px solid var(--color-border); background-color: var(--color-surface); color: var(--color-text-primary); box-shadow: var(--shadow-sm);">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `
    <div class="flex flex-col space-y-1.5 p-6">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardHeaderComponent {}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `
    <h3 class="text-2xl font-semibold leading-none tracking-tight">
      <ng-content></ng-content>
    </h3>
  `,
})
export class CardTitleComponent {}

@Component({
  selector: 'app-card-description',
  standalone: true,
  template: `
    <p class="text-sm text-gray-500">
      <ng-content></ng-content>
    </p>
  `,
})
export class CardDescriptionComponent {}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `
    <div class="p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardContentComponent {}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  template: `
    <div class="flex items-center p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardFooterComponent {}
