import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TodoFilter } from '../../models/todo.model';
import { ButtonDirective } from '../../../../shared/ui';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonDirective],
  template: `
    <div class="flex gap-2 mb-4">
      <button
        *ngFor="let filter of filters"
        appButton
        [variant]="activeFilter === filter.value ? 'default' : 'outline'"
        (click)="onFilterChange(filter.value)">
        {{ filter.labelKey | translate }}
      </button>
    </div>
  `,
})
export class TodoFiltersComponent {
  @Input() activeFilter: TodoFilter = 'all';
  @Output() filterChange = new EventEmitter<TodoFilter>();

  filters = [
    { labelKey: 'filters.all', value: 'all' as TodoFilter },
    { labelKey: 'filters.active', value: 'active' as TodoFilter },
    { labelKey: 'filters.completed', value: 'completed' as TodoFilter },
  ];

  onFilterChange(filter: TodoFilter) {
    this.filterChange.emit(filter);
  }
}
