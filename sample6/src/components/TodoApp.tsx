import { useTodos } from '../hooks/useTodos';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { ErrorMessage } from './ErrorMessage';
import './TodoApp.css';

/**
 * Main TodoApp container component.
 * 
 * Manages the overall todo application state using the useTodos hook
 * and coordinates between TodoInput and TodoList components.
 * 
 * Architecture:
 * - Uses useTodos hook for state management
 * - Passes state and callbacks to child components
 * - Follows unidirectional data flow pattern
 * - Displays critical errors and disables app when localStorage unavailable
 */
export const TodoApp = () => {
  const { todos, error, addTodo, deleteTodo, toggleTodo } = useTodos();
  
  // Determine if error is critical (localStorage unavailable)
  const isCriticalError = error ? error.includes('localStorage is not available') : false;
  const isWarning = error && !isCriticalError;
  
  // Only pass validation error to TodoInput, not system errors
  const validationError = (!isCriticalError && !isWarning) ? error : null;

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      {isCriticalError && error && <ErrorMessage message={error} type="critical" />}
      {isWarning && error && <ErrorMessage message={error} type="warning" />}
      <TodoInput onAdd={addTodo} error={validationError} disabled={isCriticalError} />
      <TodoList 
        todos={todos} 
        onToggle={toggleTodo} 
        onDelete={deleteTodo} 
      />
    </div>
  );
};
