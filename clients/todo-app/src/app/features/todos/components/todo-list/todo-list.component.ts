import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { TodoListItemComponent } from '../todo-list-item/todo-list-item.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoListItemComponent, EmptyStateComponent],
  template: `
    <div class="space-y-3">
      @if (todos.length === 0) {
        <app-empty-state
          title="No todos found"
          message="Create a new todo to get started and stay organized"
          actionLabel="Create Todo"
          actionRoute="/todos/new">
        </app-empty-state>
      } @else {
        @for (todo of todos; track todo.id) {
          <app-todo-list-item
            [todo]="todo"
            (complete)="complete.emit(todo.id)"
            (delete)="delete.emit(todo.id)">
          </app-todo-list-item>
        }
      }
    </div>
  `,
})
export class TodoListComponent {
  @Input({ required: true }) todos: Todo[] = [];
  @Output() complete = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
}
