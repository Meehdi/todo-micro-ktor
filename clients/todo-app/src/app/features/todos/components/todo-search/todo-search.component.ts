import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-6">
      <input
        type="text"
        placeholder="Search todos..."
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearchChange()"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
