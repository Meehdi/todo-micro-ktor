import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Todo, UpdateTodoDto } from '../../models/todo.model';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ButtonDirective, BadgeDirective, CardComponent, CardContentComponent } from '../../../../shared/ui';
import { LucideAngularModule, ArrowLeft, Edit, Check, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-todo-detail-page',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, LoadingSpinnerComponent, ErrorMessageComponent, ConfirmDialogComponent, ButtonDirective, BadgeDirective, CardComponent, CardContentComponent, LucideAngularModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold" style="color: var(--color-text-primary)">
          {{ editMode() ? 'Edit Todo' : 'Todo Details' }}
        </h1>
        <button (click)="goBack()" appButton variant="outline" class="gap-1">
          <lucide-icon [img]="ArrowLeft" [size]="18" [strokeWidth]="2"></lucide-icon>
          Back
        </button>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (error()) {
        <app-error-message [message]="error()" />
      } @else if (todo()) {
        <app-card>
          <app-card-content>
            @if (!editMode()) {
              <div class="space-y-4">
                <div>
                  <div class="flex items-center gap-3">
                    <h2 class="text-2xl font-semibold text-gray-900">{{ todo()!.title }}</h2>
                    @if (todo()!.completed) {
                      <span appBadge variant="success">Completed</span>
                    }
                  </div>
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
                  <button (click)="toggleEditMode()" appButton class="flex-1 gap-1">
                    <lucide-icon [img]="Edit" [size]="16" [strokeWidth]="2"></lucide-icon>
                    Edit
                  </button>
                  <button
                    *ngIf="!todo()!.completed"
                    (click)="onComplete()"
                    appButton
                    variant="secondary"
                    class="flex-1 gap-1">
                    <lucide-icon [img]="Check" [size]="16" [strokeWidth]="2"></lucide-icon>
                    Mark Complete
                  </button>
                  <button (click)="openDeleteDialog()" appButton variant="destructive" class="gap-1">
                    <lucide-icon [img]="Trash2" [size]="16" [strokeWidth]="2"></lucide-icon>
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
          </app-card-content>
        </app-card>
      }

      <app-confirm-dialog
        [open]="showDeleteDialog()"
        (openChange)="showDeleteDialog.set($event)"
        title="Delete Todo"
        description="Are you sure you want to delete this todo? This action cannot be undone."
        confirmLabel="Delete"
        (confirm)="confirmDelete()">
      </app-confirm-dialog>
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
  showDeleteDialog = signal(false);

  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Check = Check;
  readonly Trash2 = Trash2;

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

  openDeleteDialog() {
    this.showDeleteDialog.set(true);
  }

  confirmDelete() {
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
