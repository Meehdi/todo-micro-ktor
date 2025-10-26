import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogDescriptionComponent,
  DialogFooterComponent,
  ButtonDirective,
} from '../../ui';
import { LucideAngularModule, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    ButtonDirective,
    LucideAngularModule,
  ],
  template: `
    <app-dialog [open]="open" (openChange)="openChange.emit($event)">
      <app-dialog-header>
        <div class="flex items-center gap-2">
          <lucide-icon
            [img]="AlertTriangle"
            class="h-5 w-5 text-red-600"
            [strokeWidth]="2"></lucide-icon>
          <app-dialog-title>{{ title }}</app-dialog-title>
        </div>
        <app-dialog-description>{{ description }}</app-dialog-description>
      </app-dialog-header>

      <app-dialog-footer>
        <button appButton variant="outline" (click)="onCancel()">
          <span i18n="@@common.cancel">Cancel</span>
        </button>
        <button appButton variant="destructive" (click)="onConfirm()">
          {{ confirmLabel }}
        </button>
      </app-dialog-footer>
    </app-dialog>
  `,
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Are you sure?';
  @Input() description = 'This action cannot be undone.';
  @Input() confirmLabel = 'Confirm';
  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();

  readonly AlertTriangle = AlertTriangle;

  onCancel() {
    this.open = false;
    this.openChange.emit(false);
  }

  onConfirm() {
    this.confirm.emit();
    this.open = false;
    this.openChange.emit(false);
  }
}
