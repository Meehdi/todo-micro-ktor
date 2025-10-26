import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Todo } from '../../models/todo.model';
import { BadgeDirective, ButtonDirective, CheckboxDirective, CardComponent } from '../../../../shared/ui';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-todo-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeDirective, ButtonDirective, CheckboxDirective, CardComponent, LucideAngularModule],
  template: `
    <app-card class="hover:shadow-md transition-shadow">
      <div class="flex items-center gap-4 p-4">
        <input
          type="checkbox"
          appCheckbox
          [checked]="todo.completed"
          (change)="onToggleComplete()" />

        <div class="flex-1 cursor-pointer" [routerLink]="['/todos', todo.id]">
          <div class="flex items-center gap-2">
            <h3
              [class.line-through]="todo.completed"
              [class.text-gray-400]="todo.completed"
              class="font-medium text-gray-900">
              {{ todo.title }}
            </h3>
            @if (todo.completed) {
              <span appBadge variant="success" i18n="@@common.completed">Completed</span>
            }
          </div>
          <p *ngIf="todo.description" class="text-sm text-gray-600 mt-1">
            {{ todo.description }}
          </p>
          @if (todo.dueDate) {
            <span appBadge [variant]="isOverdue() ? 'destructive' : 'secondary'" class="mt-2">
              <ng-container i18n="@@dueDate">Due</ng-container>: {{ formatDate(todo.dueDate) }}
            </span>
          }
        </div>

        <button appButton variant="destructive" size="sm" (click)="onDelete()" class="gap-1">
          <lucide-icon [img]="Trash2" [size]="16" [strokeWidth]="2"></lucide-icon>
          <span i18n="@@common.delete">Delete</span>
        </button>
      </div>
    </app-card>
  `,
})
export class TodoListItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() complete = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  readonly Trash2 = Trash2;

  onToggleComplete() {
    this.complete.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  isOverdue(): boolean {
    if (!this.todo.dueDate || this.todo.completed) {
      return false;
    }
    return new Date(this.todo.dueDate) < new Date();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
