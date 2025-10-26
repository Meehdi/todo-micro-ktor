import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Todo } from '../../models/todo.model';
import { ButtonDirective, InputDirective, TextareaDirective, LabelDirective } from '../../../../shared/ui';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ButtonDirective, InputDirective, TextareaDirective, LabelDirective],
  template: `
    <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <div>
        <label for="title" appLabel class="mb-1 block">
          {{ 'form.titleLabel' | translate }} *
        </label>
        <input
          id="title"
          type="text"
          formControlName="title"
          appInput
          [class.border-red-500]="title?.invalid && title?.touched"
          [placeholder]="'form.titlePlaceholder' | translate" />
        @if (title?.invalid && title?.touched) {
          <p class="text-red-600 text-sm mt-1">
            @if (title?.errors?.['required']) {
              {{ 'form.titleRequired' | translate }}
            }
            @if (title?.errors?.['minlength']) {
              {{ 'form.titleMinLength' | translate }}
            }
          </p>
        }
      </div>

      <div>
        <label for="description" appLabel class="mb-1 block">
          {{ 'form.descriptionLabel' | translate }}
        </label>
        <textarea
          id="description"
          formControlName="description"
          rows="4"
          appTextarea
          [placeholder]="'form.descriptionPlaceholder' | translate">
        </textarea>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          appButton
          [disabled]="todoForm.invalid || submitting"
          class="flex-1">
          {{ submitLabel }}
        </button>
        <button
          type="button"
          appButton
          variant="secondary"
          (click)="onCancel()"
          class="flex-1">
          {{ 'common.cancel' | translate }}
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
  });

  get title() {
    return this.todoForm.get('title');
  }

  ngOnInit() {
    if (this.todo) {
      this.todoForm.patchValue({
        title: this.todo.title,
        description: this.todo.description || '',
      });
    }
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const payload = {
        title: formValue.title!,
        description: formValue.description || undefined,
      };
      this.submit.emit(payload);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
