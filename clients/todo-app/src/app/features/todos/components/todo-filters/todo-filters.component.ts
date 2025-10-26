import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFilter } from '../../models/todo.model';
import { ButtonDirective } from '../../../../shared/ui';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [CommonModule, ButtonDirective],
  template: `
    <div class="flex gap-2 mb-4">
      <button
        *ngFor="let filter of filters"
        appButton
        [variant]="activeFilter === filter.value ? 'default' : 'outline'"
        (click)="onFilterChange(filter.value)">
        {{ filter.label }}
      </button>
    </div>
  `,
})
export class TodoFiltersComponent {
  @Input() activeFilter: TodoFilter = 'all';
  @Output() filterChange = new EventEmitter<TodoFilter>();

  filters = [
    { label: $localize`:@@filters.all:All`, value: 'all' as TodoFilter },
    { label: $localize`:@@filters.active:Active`, value: 'active' as TodoFilter },
    { label: $localize`:@@filters.completed:Completed`, value: 'completed' as TodoFilter },
  ];

  onFilterChange(filter: TodoFilter) {
    this.filterChange.emit(filter);
  }
}
