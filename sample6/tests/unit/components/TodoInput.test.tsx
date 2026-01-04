import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useState } from 'react';
import { TodoInput } from '../../../src/components/TodoInput';

describe('TodoInput', () => {
  it('renders an input field', () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error={null} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders an Add button', () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error={null} />);
    
    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeInTheDocument();
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error={null} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'New task');
    
    expect(input.value).toBe('New task');
  });

  it('calls onAdd with input value when Add button is clicked', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error={null} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /add/i });
    
    await user.type(input, 'New task');
    await user.click(button);
    
    expect(onAdd).toHaveBeenCalledWith('New task');
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onAdd when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error={null} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'New task{Enter}');
    
    expect(onAdd).toHaveBeenCalledWith('New task');
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('clears input after successful submission (error null -> null after add)', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    
    const TestComponent = () => {
      const [error, setError] = useState<string | null>(null);
      
      const handleAdd = (task: string) => {
        onAdd(task);
        // Simulate successful add - error stays null
        setError(null);
      };
      
      return <TodoInput onAdd={handleAdd} error={error} />;
    };
    
    render(<TestComponent />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /add/i });
    
    await user.type(input, 'New task');
    expect(input.value).toBe('New task');
    
    await user.click(button);
    
    // After successful add, input should be cleared
    // Wait a bit for state updates
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(input.value).toBe('');
  });

  it('does not clear input when error is set after submission', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    
    const TestComponent = () => {
      const [error, setError] = useState<string | null>(null);
      
      const handleAdd = (task: string) => {
        onAdd(task);
        // Simulate validation error
        if (task === '') {
          setError('Task cannot be empty');
        }
      };
      
      return <TodoInput onAdd={handleAdd} error={error} />;
    };
    
    render(<TestComponent />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /add/i });
    
    // Don't type anything, just click to trigger error
    await user.click(button);
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Input should still be empty and error should be displayed
    expect(input.value).toBe('');
    expect(screen.getByText('Task cannot be empty')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error="Task cannot be empty" />);
    
    const errorMessage = screen.getByText('Task cannot be empty');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('error');
  });

  it('does not display error message when error prop is null', () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error={null} />);
    
    const errorMessage = screen.queryByText(/Task cannot be empty|Task must be/);
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('calls onAdd with empty string when Add is clicked with no input', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error={null} />);
    
    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);
    
    expect(onAdd).toHaveBeenCalledWith('');
  });

  it('has appropriate placeholder text', () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} error={null} />);
    
    const input = screen.getByPlaceholderText(/add.*task/i);
    expect(input).toBeInTheDocument();
  });
});
