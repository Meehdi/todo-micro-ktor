import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFilter } from '../../models/todo.model';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2 mb-4">
      <button
        *ngFor="let filter of filters"
        (click)="onFilterChange(filter.value)"
        [class.bg-blue-600]="activeFilter === filter.value"
        [class.text-white]="activeFilter === filter.value"
        [class.bg-gray-200]="activeFilter !== filter.value"
        [class.text-gray-700]="activeFilter !== filter.value"
        class="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-80">
        {{ filter.label }}
      </button>
    </div>
  `,
})
export class TodoFiltersComponent {
  @Input() activeFilter: TodoFilter = 'all';
  @Output() filterChange = new EventEmitter<TodoFilter>();

  filters = [
    { label: 'All', value: 'all' as TodoFilter },
    { label: 'Active', value: 'active' as TodoFilter },
    { label: 'Completed', value: 'completed' as TodoFilter },
  ];

  onFilterChange(filter: TodoFilter) {
    this.filterChange.emit(filter);
  }
}
