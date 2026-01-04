import './EmptyState.css';

/**
 * EmptyState component displayed when there are no todos.
 * 
 * Provides visual feedback to users that the todo list is empty.
 */
export const EmptyState = () => {
  return (
    <div className="empty-state">
      <p>No tasks available</p>
    </div>
  );
};
