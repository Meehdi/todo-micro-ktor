import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { CreateTodoDto } from '../../models/todo.model';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-todo-create-page',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, ErrorMessageComponent],
  template: `
    <div class="container mx-auto max-w-2xl p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Create New Todo</h1>

      @if (error()) {
        <div class="mb-6">
          <app-error-message [message]="error()" />
        </div>
      }

      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <app-todo-form
          [submitting]="submitting()"
          submitLabel="Create Todo"
          (submit)="onCreate($event)"
          (cancel)="onCancel()">
        </app-todo-form>
      </div>
    </div>
  `,
})
export class TodoCreatePageComponent {
  private todoService = inject(TodoService);
  private router = inject(Router);

  submitting = signal(false);
  error = signal<string | null>(null);

  onCreate(todoData: CreateTodoDto) {
    this.submitting.set(true);
    this.error.set(null);

    this.todoService.createTodo(todoData).subscribe({
      next: () => {
        this.router.navigate(['/todos']);
      },
      error: err => {
        this.error.set(err.message || 'Failed to create todo');
        this.submitting.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/todos']);
  }
}
