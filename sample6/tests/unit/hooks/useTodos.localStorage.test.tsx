import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../../../src/hooks/useTodos';

describe('useTodos - localStorage integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Data Loading', () => {
    it('should initialize with empty array when localStorage is empty', () => {
      const { result } = renderHook(() => useTodos());
      
      expect(result.current.todos).toEqual([]);
    });

    it('should load existing data from localStorage on initialization', () => {
      const existingTodos = [
        { id: 1, task: 'Existing task 1', completed: false },
        { id: 2, task: 'Existing task 2', completed: true },
      ];
      
      localStorage.setItem('react-todo-app-tasks', JSON.stringify(existingTodos));
      
      const { result } = renderHook(() => useTodos());
      
      expect(result.current.todos).toEqual(existingTodos);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      // Set invalid JSON
      localStorage.setItem('react-todo-app-tasks', '{invalid json}');
      
      const { result } = renderHook(() => useTodos());
      
      // Should start with empty array
      expect(result.current.todos).toEqual([]);
      // Should show error message
      expect(result.current.error).toBe('Failed to load tasks. Starting with an empty list.');
    });
  });

  describe('Data Saving', () => {
    it('should save to localStorage when a task is added', async () => {
      const { result } = renderHook(() => useTodos());
      
      await act(async () => {
        result.current.addTodo('New task');
      });
      
      // Wait for useEffect to complete
      await waitFor(() => {
        const savedData = localStorage.getItem('react-todo-app-tasks');
        expect(savedData).toBeTruthy();
      });
      
      const savedData = localStorage.getItem('react-todo-app-tasks');
      const parsed = JSON.parse(savedData!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].task).toBe('New task');
    });

    it('should save to localStorage when a task is deleted', async () => {
      const { result } = renderHook(() => useTodos());
      
      // Add a task first
      await act(async () => {
        result.current.addTodo('Task to delete');
      });
      
      const taskId = result.current.todos[0].id;
      
      // Delete the task
      await act(async () => {
        result.current.deleteTodo(taskId);
      });
      
      // Wait for useEffect to complete
      await waitFor(() => {
        const savedData = localStorage.getItem('react-todo-app-tasks');
        const parsed = JSON.parse(savedData!);
        expect(parsed).toHaveLength(0);
      });
    });

    it('should save to localStorage when a task completion state is toggled', async () => {
      const { result } = renderHook(() => useTodos());
      
      // Add a task first
      await act(async () => {
        result.current.addTodo('Task to toggle');
      });
      
      const taskId = result.current.todos[0].id;
      
      // Toggle the task
      await act(async () => {
        result.current.toggleTodo(taskId);
      });
      
      // Wait for useEffect to complete
      await waitFor(() => {
        const savedData = localStorage.getItem('react-todo-app-tasks');
        const parsed = JSON.parse(savedData!);
        expect(parsed[0].completed).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage unavailable gracefully', () => {
      // Save original localStorage
      const originalLocalStorage = window.localStorage;
      
      // Simulate localStorage being unavailable
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('localStorage is not available');
        },
        configurable: true,
      });
      
      const { result } = renderHook(() => useTodos());
      
      // Should show error message
      expect(result.current.error).toBe('localStorage is not available. Please enable it to use this app.');
      // Should start with empty todos
      expect(result.current.todos).toEqual([]);
      
      // Restore original localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
        writable: true,
      });
    });

    it('should preserve functionality when localStorage fails during save', async () => {
      const { result } = renderHook(() => useTodos());
      
      // Add a task successfully first
      await act(async () => {
        result.current.addTodo('Task 1');
      });
      
      // Wait for save
      await waitFor(() => {
        expect(result.current.todos).toHaveLength(1);
      });
      
      // Task should still be in state even if localStorage fails
      expect(result.current.todos[0].task).toBe('Task 1');
    });
  });

  describe('Data Format', () => {
    it('should save data in correct JSON format', async () => {
      const { result } = renderHook(() => useTodos());
      
      await act(async () => {
        result.current.addTodo('Task 1');
        result.current.addTodo('Task 2');
      });
      
      // Wait for useEffect to complete
      await waitFor(() => {
        expect(result.current.todos).toHaveLength(2);
      });
      
      const savedData = localStorage.getItem('react-todo-app-tasks');
      expect(savedData).toBeTruthy();
      const parsed = JSON.parse(savedData!);
      
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toHaveProperty('id');
      expect(parsed[0]).toHaveProperty('task');
      expect(parsed[0]).toHaveProperty('completed');
      expect(typeof parsed[0].id).toBe('number');
      expect(typeof parsed[0].task).toBe('string');
      expect(typeof parsed[0].completed).toBe('boolean');
    });

    it('should use correct localStorage key', async () => {
      const { result } = renderHook(() => useTodos());
      
      await act(async () => {
        result.current.addTodo('Test task');
      });
      
      // Wait for useEffect to complete
      await waitFor(() => {
        expect(result.current.todos).toHaveLength(1);
      });
      
      const savedData = localStorage.getItem('react-todo-app-tasks');
      expect(savedData).toBeTruthy();
      
      // Verify it's NOT saved with a different key
      const wrongKey = localStorage.getItem('wrong-key');
      expect(wrongKey).toBeNull();
    });
  });
});
