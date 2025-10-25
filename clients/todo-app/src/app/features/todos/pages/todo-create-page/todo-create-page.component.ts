import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { CreateTodoDto } from '../../models/todo.model';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { CardComponent, CardContentComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-todo-create-page',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, ErrorMessageComponent, CardComponent, CardContentComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6" style="color: var(--color-text-primary)">Create New Todo</h1>

      @if (error()) {
        <div class="mb-6">
          <app-error-message [message]="error()" />
        </div>
      }

      <app-card>
        <app-card-content>
          <app-todo-form
            [submitting]="submitting()"
            submitLabel="Create Todo"
            (submit)="onCreate($event)"
            (cancel)="onCancel()">
          </app-todo-form>
        </app-card-content>
      </app-card>
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
