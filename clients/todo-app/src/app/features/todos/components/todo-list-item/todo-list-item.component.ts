import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        [checked]="todo.completed"
        (change)="onToggleComplete()"
        class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

      <div class="flex-1 cursor-pointer" [routerLink]="['/todos', todo.id]">
        <h3
          [class.line-through]="todo.completed"
          [class.text-gray-400]="todo.completed"
          class="font-medium text-gray-900">
          {{ todo.title }}
        </h3>
        <p *ngIf="todo.description" class="text-sm text-gray-600 mt-1">
          {{ todo.description }}
        </p>
        <div class="flex gap-2 mt-2">
          <span
            *ngIf="todo.dueDate"
            [class.text-red-600]="isOverdue()"
            class="text-xs text-gray-500">
            Due: {{ formatDate(todo.dueDate) }}
          </span>
          <span *ngIf="todo.completed" class="text-xs text-green-600 font-medium">
            Completed
          </span>
        </div>
      </div>

      <button
        (click)="onDelete()"
        class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
        Delete
      </button>
    </div>
  `,
})
export class TodoListItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() complete = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

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
