import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          formControlName="title"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          [class.border-red-500]="title?.invalid && title?.touched" />
        @if (title?.invalid && title?.touched) {
          <p class="text-red-600 text-sm mt-1">
            @if (title?.errors?.['required']) {
              Title is required
            }
            @if (title?.errors?.['minlength']) {
              Title must be at least 3 characters
            }
          </p>
        }
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          formControlName="description"
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </textarea>
      </div>

      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          id="dueDate"
          type="datetime-local"
          formControlName="dueDate"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          [disabled]="todoForm.invalid || submitting"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ submitLabel }}
        </button>
        <button
          type="button"
          (click)="onCancel()"
          class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  `,
})
export class TodoFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() todo: Todo | null = null;
  @Input() submitLabel = 'Save';
  @Input() submitting = false;
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter<void>();

  todoForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    dueDate: [''],
  });

  get title() {
    return this.todoForm.get('title');
  }

  ngOnInit() {
    if (this.todo) {
      this.todoForm.patchValue({
        title: this.todo.title,
        description: this.todo.description || '',
        dueDate: this.todo.dueDate ? this.formatDateForInput(this.todo.dueDate) : '',
      });
    }
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const payload = {
        title: formValue.title!,
        description: formValue.description || undefined,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString() : undefined,
      };
      this.submit.emit(payload);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
