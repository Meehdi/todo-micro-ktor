export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  dueDate?: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';
