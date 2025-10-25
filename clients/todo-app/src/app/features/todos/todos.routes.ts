import { Routes } from '@angular/router';
import { TodoListPageComponent } from './pages/todo-list-page/todo-list-page.component';
import { TodoDetailPageComponent } from './pages/todo-detail-page/todo-detail-page.component';
import { TodoCreatePageComponent } from './pages/todo-create-page/todo-create-page.component';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
    component: TodoListPageComponent,
  },
  {
    path: 'new',
    component: TodoCreatePageComponent,
  },
  {
    path: ':id',
    component: TodoDetailPageComponent,
  },
];
