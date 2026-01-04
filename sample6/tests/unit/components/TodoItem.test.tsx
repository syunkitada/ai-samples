import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoItem } from '../../../src/components/TodoItem';
import type { Todo } from '../../../src/types/todo';

describe('TodoItem', () => {
  const mockIncompleteTodo: Todo = {
    id: 1,
    task: 'Test task',
    completed: false,
  };

  const mockCompletedTodo: Todo = {
    id: 2,
    task: 'Completed task',
    completed: true,
  };

  it('displays the task text', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockIncompleteTodo} onToggle={onToggle} onDelete={onDelete} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('renders a checkbox', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockIncompleteTodo} onToggle={onToggle} onDelete={onDelete} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('checkbox is unchecked for incomplete task', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockIncompleteTodo} onToggle={onToggle} onDelete={onDelete} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('checkbox is checked for completed task', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockCompletedTodo} onToggle={onToggle} onDelete={onDelete} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockIncompleteTodo} onToggle={onToggle} onDelete={onDelete} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(mockIncompleteTodo.id);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders a delete button', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockIncompleteTodo} onToggle={onToggle} onDelete={onDelete} />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockIncompleteTodo} onToggle={onToggle} onDelete={onDelete} />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    
    await user.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(mockIncompleteTodo.id);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('applies grayed-out style to completed task text', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockCompletedTodo} onToggle={onToggle} onDelete={onDelete} />);
    const taskText = screen.getByText('Completed task');
    expect(taskText).toHaveClass('completed');
  });

  it('does not apply grayed-out style to incomplete task text', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoItem todo={mockIncompleteTodo} onToggle={onToggle} onDelete={onDelete} />);
    const taskText = screen.getByText('Test task');
    expect(taskText).not.toHaveClass('completed');
  });
});
