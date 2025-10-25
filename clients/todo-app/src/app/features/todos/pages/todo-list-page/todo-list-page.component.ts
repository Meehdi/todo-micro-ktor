import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoFilter } from '../../models/todo.model';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoFiltersComponent } from '../../components/todo-filters/todo-filters.component';
import { TodoSearchComponent } from '../../components/todo-search/todo-search.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-todo-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TodoListComponent,
    TodoFiltersComponent,
    TodoSearchComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  template: `
    <div class="container mx-auto max-w-4xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">My Todos</h1>
        <button
          routerLink="/todos/new"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          New Todo
        </button>
      </div>

      <app-todo-filters
        [activeFilter]="activeFilter()"
        (filterChange)="onFilterChange($event)">
      </app-todo-filters>

      <app-todo-search (searchChange)="onSearchChange($event)"> </app-todo-search>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (error()) {
        <app-error-message [message]="error()" />
      } @else {
        <app-todo-list
          [todos]="filteredTodos()"
          (complete)="onComplete($event)"
          (delete)="onDelete($event)">
        </app-todo-list>
      }
    </div>
  `,
})
export class TodoListPageComponent implements OnInit {
  private todoService = inject(TodoService);

  todos = signal<Todo[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFilter = signal<TodoFilter>('all');
  searchTerm = signal('');

  filteredTodos = computed(() => {
    const todos = this.todos();
    const filter = this.activeFilter();
    const search = this.searchTerm().toLowerCase();

    return todos
      .filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      })
      .filter(
        todo =>
          todo.title.toLowerCase().includes(search) ||
          todo.description?.toLowerCase().includes(search)
      );
  });

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.loading.set(true);
    this.error.set(null);

    this.todoService.getTodos().subscribe({
      next: todos => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message || 'Failed to load todos');
        this.loading.set(false);
      },
    });
  }

  onFilterChange(filter: TodoFilter) {
    this.activeFilter.set(filter);
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
  }

  onComplete(id: string) {
    this.todoService.completeTodo(id).subscribe({
      next: updatedTodo => {
        this.todos.update(todos =>
          todos.map(todo => (todo.id === id ? updatedTodo : todo))
        );
      },
      error: err => {
        this.error.set(err.message || 'Failed to update todo');
      },
    });
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.todos.update(todos => todos.filter(todo => todo.id !== id));
        },
        error: err => {
          this.error.set(err.message || 'Failed to delete todo');
        },
      });
    }
  }
}
