import { useState } from 'react';
import { Todo } from '../types/todo';
import { validateTask } from '../utils/validation';

interface UseTodosReturn {
  todos: Todo[];
  error: string | null;
  addTodo: (text: string) => void;
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
}

/**
 * Module-level ID counter for generating unique todo IDs.
 * This persists across component re-renders but resets on page reload.
 */
let nextId = 1;

/**
 * Custom hook for managing todo list state and operations.
 * 
 * Provides:
 * - todos: Array of all todo items
 * - error: Validation error message (null if no error)
 * - addTodo: Function to add a new todo with validation
 * - deleteTodo: Function to remove a todo by ID
 * - toggleTodo: Function to toggle completion status
 * 
 * @returns {UseTodosReturn} Todo state and operations
 */
export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Adds a new todo item after validating the input text.
   * Sets error state if validation fails.
   * 
   * @param text - The task text to add
   */
  const addTodo = (text: string) => {
    const validationError = validateTask(text);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    const newTodo: Todo = {
      id: nextId++,
      task: text,
      completed: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setError(null);
  };

  /**
   * Removes a todo item by its ID.
   * 
   * @param id - The ID of the todo to delete
   */
  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  /**
   * Toggles the completion status of a todo item.
   * 
   * @param id - The ID of the todo to toggle
   */
  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return {
    todos,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
  };
}
