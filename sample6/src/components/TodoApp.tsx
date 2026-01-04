import { useTodos } from '../hooks/useTodos';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
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
 */
export const TodoApp = () => {
  const { todos, error, addTodo, deleteTodo, toggleTodo } = useTodos();

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <TodoInput onAdd={addTodo} error={error} />
      <TodoList 
        todos={todos} 
        onToggle={toggleTodo} 
        onDelete={deleteTodo} 
      />
    </div>
  );
};
