import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Todo, UpdateTodoDto } from '../../models/todo.model';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-todo-detail-page',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="container mx-auto max-w-2xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ editMode() ? 'Edit Todo' : 'Todo Details' }}
        </h1>
        <button
          (click)="goBack()"
          class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          Back
        </button>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (error()) {
        <app-error-message [message]="error()" />
      } @else if (todo()) {
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          @if (!editMode()) {
            <div class="space-y-4">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900">{{ todo()!.title }}</h2>
                @if (todo()!.completed) {
                  <span
                    class="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Completed
                  </span>
                }
              </div>

              @if (todo()!.description) {
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-1">Description</h3>
                  <p class="text-gray-600">{{ todo()!.description }}</p>
                </div>
              }

              @if (todo()!.dueDate) {
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
                  <p class="text-gray-600">{{ formatDate(todo()!.dueDate) }}</p>
                </div>
              }

              <div class="text-sm text-gray-500">
                <p>Created: {{ formatDate(todo()!.createdAt) }}</p>
                <p>Updated: {{ formatDate(todo()!.updatedAt) }}</p>
              </div>

              <div class="flex gap-3 pt-4 border-t">
                <button
                  (click)="toggleEditMode()"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Edit
                </button>
                <button
                  *ngIf="!todo()!.completed"
                  (click)="onComplete()"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Mark Complete
                </button>
                <button
                  (click)="onDelete()"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          } @else {
            <app-todo-form
              [todo]="todo()!"
              [submitting]="submitting()"
              submitLabel="Update Todo"
              (submit)="onUpdate($event)"
              (cancel)="toggleEditMode()">
            </app-todo-form>
          }
        </div>
      }
    </div>
  `,
})
export class TodoDetailPageComponent implements OnInit {
  private todoService = inject(TodoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  todo = signal<Todo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  editMode = signal(false);
  submitting = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTodo(id);
    }
  }

  loadTodo(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.todoService.getTodo(id).subscribe({
      next: todo => {
        this.todo.set(todo);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message || 'Failed to load todo');
        this.loading.set(false);
      },
    });
  }

  toggleEditMode() {
    this.editMode.update(mode => !mode);
  }

  onUpdate(todoData: UpdateTodoDto) {
    const currentTodo = this.todo();
    if (!currentTodo) return;

    this.submitting.set(true);
    this.error.set(null);

    this.todoService.updateTodo(currentTodo.id, todoData).subscribe({
      next: updatedTodo => {
        this.todo.set(updatedTodo);
        this.editMode.set(false);
        this.submitting.set(false);
      },
      error: err => {
        this.error.set(err.message || 'Failed to update todo');
        this.submitting.set(false);
      },
    });
  }

  onComplete() {
    const currentTodo = this.todo();
    if (!currentTodo) return;

    this.todoService.completeTodo(currentTodo.id).subscribe({
      next: updatedTodo => {
        this.todo.set(updatedTodo);
      },
      error: err => {
        this.error.set(err.message || 'Failed to complete todo');
      },
    });
  }

  onDelete() {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    const currentTodo = this.todo();
    if (!currentTodo) return;

    this.todoService.deleteTodo(currentTodo.id).subscribe({
      next: () => {
        this.router.navigate(['/todos']);
      },
      error: err => {
        this.error.set(err.message || 'Failed to delete todo');
      },
    });
  }

  goBack() {
    this.router.navigate(['/todos']);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
