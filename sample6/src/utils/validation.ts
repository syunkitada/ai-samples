/**
 * Validation error messages
 */
export const ValidationError = {
  EMPTY_TASK: 'Task cannot be empty',
  TOO_LONG: 'Task must be 128 characters or less',
} as const;

/**
 * Validates a task text
 * @param text - The task text to validate
 * @returns null if valid, error message if invalid
 */
export function validateTask(text: string): string | null {
  // Check for empty string (after trimming whitespace)
  if (text.trim() === '') {
    return ValidationError.EMPTY_TASK;
  }

  // Check for character limit
  if (text.length > 128) {
    return ValidationError.TOO_LONG;
  }

  return null;
}
