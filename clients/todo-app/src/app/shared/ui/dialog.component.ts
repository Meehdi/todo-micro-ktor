import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          (click)="onClose()"></div>

        <!-- Dialog Content -->
        <div
          class="relative z-50 grid w-full max-w-lg gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
})
export class DialogComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  onClose() {
    this.open = false;
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  template: `
    <div class="flex flex-col space-y-1.5 text-center sm:text-left">
      <ng-content></ng-content>
    </div>
  `,
})
export class DialogHeaderComponent {}

@Component({
  selector: 'app-dialog-title',
  standalone: true,
  template: `
    <h3 class="text-lg font-semibold leading-none tracking-tight">
      <ng-content></ng-content>
    </h3>
  `,
})
export class DialogTitleComponent {}

@Component({
  selector: 'app-dialog-description',
  standalone: true,
  template: `
    <p class="text-sm text-gray-500">
      <ng-content></ng-content>
    </p>
  `,
})
export class DialogDescriptionComponent {}

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  template: `
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <ng-content></ng-content>
    </div>
  `,
})
export class DialogFooterComponent {}
