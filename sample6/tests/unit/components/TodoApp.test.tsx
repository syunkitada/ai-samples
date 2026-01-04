import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoApp } from '../../../src/components/TodoApp';

describe('TodoApp', () => {
  it('renders TodoInput component', () => {
    render(<TodoApp />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders EmptyState initially', () => {
    render(<TodoApp />);
    
    expect(screen.getByText('No tasks available')).toBeInTheDocument();
  });

  it('adds a new todo when valid task is submitted', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(input, 'New task');
    await user.click(addButton);
    
    // EmptyState should be gone
    expect(screen.queryByText('No tasks available')).not.toBeInTheDocument();
    
    // New task should be displayed
    expect(screen.getByText('New task')).toBeInTheDocument();
  });

  it('displays error when empty task is submitted', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const addButton = screen.getByRole('button', { name: /add/i });
    
    await user.click(addButton);
    
    expect(screen.getByText('Task cannot be empty')).toBeInTheDocument();
  });

  it('displays error when task exceeds 128 characters', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: /add/i });
    const longTask = 'a'.repeat(129);
    
    await user.type(input, longTask);
    await user.click(addButton);
    
    expect(screen.getByText('Task must be 128 characters or less')).toBeInTheDocument();
  });

  it('toggles todo completion status', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(input, 'Task to toggle');
    await user.click(addButton);
    
    const taskText = screen.getByText('Task to toggle');
    expect(taskText).not.toHaveClass('completed');
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(taskText).toHaveClass('completed');
    
    await user.click(checkbox);
    expect(taskText).not.toHaveClass('completed');
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(input, 'Task to delete');
    await user.click(addButton);
    
    expect(screen.getByText('Task to delete')).toBeInTheDocument();
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
    expect(screen.getByText('No tasks available')).toBeInTheDocument();
  });

  it('manages multiple todos', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(input, 'First task');
    await user.click(addButton);
    
    await user.type(input, 'Second task');
    await user.click(addButton);
    
    await user.type(input, 'Third task');
    await user.click(addButton);
    
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
    expect(screen.getByText('Third task')).toBeInTheDocument();
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('clears error when valid task is submitted after error', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);
    
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Submit empty to trigger error
    await user.click(addButton);
    expect(screen.getByText('Task cannot be empty')).toBeInTheDocument();
    
    // Submit valid task
    await user.type(input, 'Valid task');
    await user.click(addButton);
    
    // Error should be cleared
    expect(screen.queryByText('Task cannot be empty')).not.toBeInTheDocument();
    expect(screen.getByText('Valid task')).toBeInTheDocument();
  });
});
