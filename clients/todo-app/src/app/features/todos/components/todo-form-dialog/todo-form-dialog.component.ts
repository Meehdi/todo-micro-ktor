import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { CreateTodoDto } from '../../models/todo.model';
import {
  DialogComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogDescriptionComponent,
} from '../../../../shared/ui';

@Component({
  selector: 'app-todo-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TodoFormComponent,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
  ],
  template: `
    <app-dialog [open]="open" (openChange)="openChange.emit($event)">
      <app-dialog-header>
        <app-dialog-title>Create New Todo</app-dialog-title>
        <app-dialog-description>
          Add a new task to your todo list. Fill in the details below.
        </app-dialog-description>
      </app-dialog-header>

      <div class="mt-4">
        <app-todo-form
          [submitting]="submitting"
          submitLabel="Create Todo"
          (submit)="onCreate($event)"
          (cancel)="onCancel()">
        </app-todo-form>
      </div>
    </app-dialog>
  `,
})
export class TodoFormDialogComponent {
  @Input() open = false;
  @Input() submitting = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<CreateTodoDto>();

  onCreate(todoData: CreateTodoDto) {
    this.create.emit(todoData);
  }

  onCancel() {
    this.open = false;
    this.openChange.emit(false);
  }
}
