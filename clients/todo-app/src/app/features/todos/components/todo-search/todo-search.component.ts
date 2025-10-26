import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDirective } from '../../../../shared/ui';

@Component({
  selector: 'app-todo-search',
  standalone: true,
  imports: [FormsModule, InputDirective],
  template: `
    <div class="mb-6">
      <input
        type="text"
        placeholder="Search..."
        i18n-placeholder="@@common.search"
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearchChange()"
        appInput />
    </div>
  `,
})
export class TodoSearchComponent {
  @Output() searchChange = new EventEmitter<string>();
  searchTerm = '';

  onSearchChange() {
    this.searchChange.emit(this.searchTerm);
  }
}
