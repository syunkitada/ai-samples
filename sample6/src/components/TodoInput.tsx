import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import './TodoInput.css';

interface TodoInputProps {
  onAdd: (task: string) => void;
  error: string | null;
  disabled?: boolean;
}

/**
 * Input component for adding new todo items.
 * 
 * Features:
 * - Text input with validation error display
 * - Automatic input clearing on successful submission
 * - Keyboard support (Enter key to submit)
 * - Accessibility attributes (ARIA)
 * - Can be disabled when critical errors occur
 * 
 * @param onAdd - Callback function to add a new todo
 * @param error - Validation error message from parent (null if no error)
 * @param disabled - Whether the input should be disabled (e.g., localStorage unavailable)
 */
export const TodoInput = ({ onAdd, error, disabled = false }: TodoInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const previousErrorRef = useRef<string | null>(null);

  /**
   * Effect to clear input field on successful submission.
   * 
   * Clears input when:
   * 1. Error transitions from non-null to null (error was fixed)
   * 
   * This approach ensures the input is cleared only after a successful
   * submission, not when the error prop is initially null.
   */
  useEffect(() => {
    if (previousErrorRef.current !== null && error === null) {
      // Error cleared - successful submission after previous error
      setInputValue('');
    }
    previousErrorRef.current = error;
  }, [error]);

  /**
   * Handles form submission by calling onAdd callback.
   * Clears input immediately if there was no previous error and input is valid.
   */
  const handleSubmit = () => {
    if (disabled) return;
    
    const previousError = previousErrorRef.current;
    onAdd(inputValue);
    
    // If there was no previous error and we submit, we expect success
    // Clear immediately in this case
    if (previousError === null && inputValue.trim() !== '') {
      setInputValue('');
    }
  };

  /**
   * Handles keyboard events, submitting on Enter key press.
   */
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="todo-input-container">
      <div className="input-row">
        <input
          type="text"
          className="todo-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          aria-label="New task input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : undefined}
          disabled={disabled}
        />
        <button
          className="add-button"
          onClick={handleSubmit}
          aria-label="Add"
          disabled={disabled}
        >
          Add
        </button>
      </div>
      {error && <div id="error-message" className="error">{error}</div>}
    </div>
  );
};
