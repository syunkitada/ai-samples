import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoList } from '../../../src/components/TodoList';
import type { Todo } from '../../../src/types/todo';

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: 1, task: 'First task', completed: false },
    { id: 2, task: 'Second task', completed: true },
    { id: 3, task: 'Third task', completed: false },
  ];

  it('renders EmptyState when todos array is empty', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoList todos={[]} onToggle={onToggle} onDelete={onDelete} />);
    expect(screen.getByText('No tasks available')).toBeInTheDocument();
  });

  it('does not render EmptyState when todos exist', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />);
    expect(screen.queryByText('No tasks available')).not.toBeInTheDocument();
  });

  it('renders a TodoItem for each todo', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />);
    
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
    expect(screen.getByText('Third task')).toBeInTheDocument();
  });

  it('renders todos in insertion order', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    const { container } = render(<TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />);
    const taskTexts = container.querySelectorAll('.todo-item span');
    
    expect(taskTexts[0]).toHaveTextContent('First task');
    expect(taskTexts[1]).toHaveTextContent('Second task');
    expect(taskTexts[2]).toHaveTextContent('Third task');
  });

  it('passes onToggle callback to TodoItem', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('passes onDelete callback to TodoItem', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[1]);
    
    expect(onDelete).toHaveBeenCalledWith(2);
  });

  it('renders correct number of TodoItems', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    
    render(<TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });
});
