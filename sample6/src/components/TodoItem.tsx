import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * Individual todo item component.
 * 
 * Features:
 * - Checkbox for toggling completion status
 * - Task text with visual styling for completed items
 * - Delete button
 * - Full accessibility support with ARIA labels
 * 
 * @param todo - The todo item data
 * @param onToggle - Callback to toggle completion status
 * @param onDelete - Callback to delete this todo
 */
export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle ${todo.task}`}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.task}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.task}`}
        className="delete-button"
      >
        Delete
      </button>
    </div>
  );
};
