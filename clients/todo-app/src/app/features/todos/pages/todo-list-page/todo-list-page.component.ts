import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoFilter, CreateTodoDto } from '../../models/todo.model';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoFiltersComponent } from '../../components/todo-filters/todo-filters.component';
import { TodoSearchComponent } from '../../components/todo-search/todo-search.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TodoFormDialogComponent } from '../../components/todo-form-dialog/todo-form-dialog.component';
import { ButtonDirective } from '../../../../shared/ui';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-todo-list-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TodoListComponent,
    TodoFiltersComponent,
    TodoSearchComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    ConfirmDialogComponent,
    TodoFormDialogComponent,
    ButtonDirective,
    LucideAngularModule,
  ],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold" style="color: var(--color-text-primary)">{{ 'todo.myTodos' | translate }}</h1>
        <button (click)="openCreateDialog()" appButton class="gap-1">
          <lucide-icon [img]="Plus" [size]="18" [strokeWidth]="2"></lucide-icon>
          {{ 'todo.newTodo' | translate }}
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
          (delete)="openDeleteDialog($event)">
        </app-todo-list>
      }

      <app-todo-form-dialog
        [open]="showCreateDialog()"
        [submitting]="creatingTodo()"
        (openChange)="showCreateDialog.set($event)"
        (create)="onCreate($event)">
      </app-todo-form-dialog>

      <app-confirm-dialog
        [open]="showDeleteDialog()"
        (openChange)="showDeleteDialog.set($event)"
        [title]="'dialog.deleteTodo.title' | translate"
        [description]="'dialog.deleteTodo.description' | translate"
        [confirmLabel]="'dialog.deleteTodo.confirm' | translate"
        (confirm)="confirmDelete()">
      </app-confirm-dialog>
    </div>
  `,
})
export class TodoListPageComponent implements OnInit {
  private todoService = inject(TodoService);
  private translateService = inject(TranslateService);

  todos = signal<Todo[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFilter = signal<TodoFilter>('all');
  searchTerm = signal('');
  showDeleteDialog = signal(false);
  todoToDelete = signal<string | null>(null);
  showCreateDialog = signal(false);
  creatingTodo = signal(false);

  readonly Plus = Plus;

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
        this.error.set(err.message || this.translateService.instant('errors.failedToLoad'));
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
        this.error.set(err.message || this.translateService.instant('errors.failedToUpdate'));
      },
    });
  }

  openDeleteDialog(id: string) {
    this.todoToDelete.set(id);
    this.showDeleteDialog.set(true);
  }

  confirmDelete() {
    const id = this.todoToDelete();
    if (!id) return;

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update(todos => todos.filter(todo => todo.id !== id));
        this.todoToDelete.set(null);
      },
      error: err => {
        this.error.set(err.message || this.translateService.instant('errors.failedToDelete'));
      },
    });
  }

  openCreateDialog() {
    this.showCreateDialog.set(true);
  }

  onCreate(todoData: CreateTodoDto) {
    this.creatingTodo.set(true);
    this.error.set(null);

    this.todoService.createTodo(todoData).subscribe({
      next: newTodo => {
        this.todos.update(todos => [newTodo, ...todos]);
        this.showCreateDialog.set(false);
        this.creatingTodo.set(false);
      },
      error: err => {
        this.error.set(err.message || this.translateService.instant('errors.failedToCreate'));
        this.creatingTodo.set(false);
      },
    });
  }
}
