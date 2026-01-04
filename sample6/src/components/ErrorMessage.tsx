import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  type?: 'critical' | 'warning';
}

/**
 * ErrorMessage component for displaying system-level error messages.
 * 
 * Features:
 * - Critical errors: localStorage unavailable, corrupted data, etc.
 * - Warning errors: Non-blocking issues
 * - Accessible with proper ARIA attributes
 * 
 * @param message - The error message to display
 * @param type - The severity level ('critical' or 'warning')
 */
export const ErrorMessage = ({ message, type = 'critical' }: ErrorMessageProps) => {
  return (
    <div 
      className={`error-message ${type}`}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};
