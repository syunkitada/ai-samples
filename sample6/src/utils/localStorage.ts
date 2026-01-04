/**
 * localStorage utility functions for managing todo data persistence
 */

export const STORAGE_KEY = 'react-todo-app-tasks';

/**
 * Check if localStorage is available
 * @returns {boolean} true if localStorage is available, false otherwise
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save data to localStorage
 * @param {string} key - The localStorage key
 * @param {unknown} data - The data to save (will be JSON stringified)
 * @throws {Error} If localStorage is not available or quota is exceeded
 */
export function saveToLocalStorage(key: string, data: unknown): void {
  try {
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please free up some space.');
      }
      throw new Error(`Failed to save to localStorage: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load data from localStorage
 * @param {string} key - The localStorage key
 * @param {T} defaultValue - The default value to return if key doesn't exist or parsing fails
 * @returns {T} The parsed data or default value
 */
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    // Return default value on parse error (corrupted data)
    return defaultValue;
  }
}
