import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { validateTask } from '../utils/validation';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  isLocalStorageAvailable,
  STORAGE_KEY 
} from '../utils/localStorage';

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
 * Custom hook for managing todo list state and operations with localStorage persistence.
 * 
 * Provides:
 * - todos: Array of all todo items (persisted to localStorage)
 * - error: Validation or storage error message (null if no error)
 * - addTodo: Function to add a new todo with validation
 * - deleteTodo: Function to remove a todo by ID
 * - toggleTodo: Function to toggle completion status
 * 
 * localStorage integration:
 * - Loads todos from localStorage on initialization
 * - Saves todos to localStorage whenever they change
 * - Handles corrupted data gracefully
 * - Displays appropriate errors when localStorage is unavailable
 * 
 * @returns {UseTodosReturn} Todo state and operations
 */
export function useTodos(): UseTodosReturn {
  // Initialize todos from localStorage, with error handling
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      return [];
    }

    try {
      const stored = loadFromLocalStorage<Todo[]>(STORAGE_KEY, []);
      
      // Update nextId to be higher than any existing ID
      if (stored.length > 0) {
        const maxId = Math.max(...stored.map(todo => todo.id));
        nextId = maxId + 1;
      }
      
      return stored;
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      return [];
    }
  });

  const [error, setError] = useState<string | null>(() => {
    // Set error if localStorage is not available
    if (!isLocalStorageAvailable()) {
      return 'localStorage is not available. Please enable it to use this app.';
    }

    // Check for corrupted data
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item !== null && item !== '[]') {
        JSON.parse(item);
      }
    } catch {
      // Data is corrupted, will be reset to empty array
      saveToLocalStorage(STORAGE_KEY, []);
      return 'Failed to load tasks. Starting with an empty list.';
    }

    return null;
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      return; // Skip if localStorage is not available
    }

    try {
      saveToLocalStorage(STORAGE_KEY, todos);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }, [todos]);

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
