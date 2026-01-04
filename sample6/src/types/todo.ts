/**
 * Todo item interface
 */
export interface Todo {
  /** Unique identifier for the todo */
  id: number;
  /** Task text (1-128 characters) */
  task: string;
  /** Whether the task is completed */
  completed: boolean;
}

/**
 * Actions that can be performed on todos
 */
export type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'DELETE'; id: number }
  | { type: 'TOGGLE'; id: number };
