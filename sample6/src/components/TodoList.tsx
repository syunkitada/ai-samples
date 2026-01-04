import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * Component that renders a list of todo items or an empty state.
 * 
 * Displays:
 * - EmptyState component when no todos exist
 * - List of TodoItem components for each todo
 * 
 * @param todos - Array of todo items to display
 * @param onToggle - Callback to toggle todo completion status
 * @param onDelete - Callback to delete a todo
 */
export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
