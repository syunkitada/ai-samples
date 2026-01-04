import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../../../src/hooks/useTodos';

describe('useTodos', () => {
  // Clear localStorage before each test to ensure test isolation
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initial state', () => {
    it('should initialize with an empty todos array', () => {
      const { result } = renderHook(() => useTodos());
      expect(result.current.todos).toEqual([]);
    });

    it('should initialize with no error', () => {
      const { result } = renderHook(() => useTodos());
      expect(result.current.error).toBeNull();
    });
  });

  describe('addTodo', () => {
    it('should add a todo with valid input', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Buy groceries');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0]).toMatchObject({
        id: expect.any(Number),
        task: 'Buy groceries',
        completed: false,
      });
      expect(result.current.error).toBeNull();
    });

    it('should add multiple todos and maintain order', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('First task');
      });

      act(() => {
        result.current.addTodo('Second task');
      });

      expect(result.current.todos).toHaveLength(2);
      expect(result.current.todos[0].task).toBe('First task');
      expect(result.current.todos[1].task).toBe('Second task');
    });

    it('should generate unique IDs for each todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task 1');
      });

      act(() => {
        result.current.addTodo('Task 2');
      });

      const ids = result.current.todos.map((todo) => todo.id);
      expect(new Set(ids).size).toBe(2); // All IDs should be unique
    });

    it('should not add todo with empty string and set error', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('');
      });

      expect(result.current.todos).toHaveLength(0);
      expect(result.current.error).toBe('Task cannot be empty');
    });

    it('should not add todo with whitespace only and set error', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('   ');
      });

      expect(result.current.todos).toHaveLength(0);
      expect(result.current.error).toBe('Task cannot be empty');
    });

    it('should not add todo with more than 128 characters and set error', () => {
      const { result } = renderHook(() => useTodos());
      const longTask = 'a'.repeat(129);

      act(() => {
        result.current.addTodo(longTask);
      });

      expect(result.current.todos).toHaveLength(0);
      expect(result.current.error).toBe('Task must be 128 characters or less');
    });

    it('should add todo with exactly 128 characters', () => {
      const { result } = renderHook(() => useTodos());
      const task128 = 'a'.repeat(128);

      act(() => {
        result.current.addTodo(task128);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].task).toBe(task128);
      expect(result.current.error).toBeNull();
    });

    it('should clear previous error on successful add', () => {
      const { result } = renderHook(() => useTodos());

      // First, cause an error
      act(() => {
        result.current.addTodo('');
      });
      expect(result.current.error).toBe('Task cannot be empty');

      // Then add a valid task
      act(() => {
        result.current.addTodo('Valid task');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.error).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo by id', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task to delete');
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(todoId);
      });

      expect(result.current.todos).toHaveLength(0);
    });

    it('should delete only the specified todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task 1');
      });

      act(() => {
        result.current.addTodo('Task 2');
      });

      act(() => {
        result.current.addTodo('Task 3');
      });

      const secondTodoId = result.current.todos[1].id;

      act(() => {
        result.current.deleteTodo(secondTodoId);
      });

      expect(result.current.todos).toHaveLength(2);
      expect(result.current.todos[0].task).toBe('Task 1');
      expect(result.current.todos[1].task).toBe('Task 3');
    });

    it('should do nothing if todo id does not exist', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task 1');
      });

      act(() => {
        result.current.deleteTodo(999); // Non-existent ID
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].task).toBe('Task 1');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo from incomplete to complete', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task to toggle');
      });

      const todoId = result.current.todos[0].id;
      expect(result.current.todos[0].completed).toBe(false);

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.todos[0].completed).toBe(true);
    });

    it('should toggle todo from complete to incomplete', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task to toggle');
      });

      const todoId = result.current.todos[0].id;

      // Toggle to complete
      act(() => {
        result.current.toggleTodo(todoId);
      });
      expect(result.current.todos[0].completed).toBe(true);

      // Toggle back to incomplete
      act(() => {
        result.current.toggleTodo(todoId);
      });
      expect(result.current.todos[0].completed).toBe(false);
    });

    it('should toggle only the specified todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task 1');
      });

      act(() => {
        result.current.addTodo('Task 2');
      });

      act(() => {
        result.current.addTodo('Task 3');
      });

      const secondTodoId = result.current.todos[1].id;

      act(() => {
        result.current.toggleTodo(secondTodoId);
      });

      expect(result.current.todos[0].completed).toBe(false);
      expect(result.current.todos[1].completed).toBe(true);
      expect(result.current.todos[2].completed).toBe(false);
    });

    it('should do nothing if todo id does not exist', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Task 1');
      });

      act(() => {
        result.current.toggleTodo(999); // Non-existent ID
      });

      expect(result.current.todos[0].completed).toBe(false);
    });
  });
});
