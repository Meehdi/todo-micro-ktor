import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { TodoListItemComponent } from '../todo-list-item/todo-list-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoListItemComponent],
  template: `
    <div class="space-y-3">
      @if (todos.length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg">No todos found</p>
          <p class="text-gray-400 text-sm mt-2">Create a new todo to get started</p>
        </div>
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
