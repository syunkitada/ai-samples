import { describe, it, expect } from 'vitest';
import { validateTask, ValidationError } from '../../../src/utils/validation';

describe('validateTask', () => {
  describe('empty string validation', () => {
    it('should return error for empty string', () => {
      const result = validateTask('');
      expect(result).toBe(ValidationError.EMPTY_TASK);
    });

    it('should return error for whitespace-only string', () => {
      const result = validateTask('   ');
      expect(result).toBe(ValidationError.EMPTY_TASK);
    });

    it('should return error for tabs and newlines', () => {
      const result = validateTask('\t\n');
      expect(result).toBe(ValidationError.EMPTY_TASK);
    });
  });

  describe('character limit validation', () => {
    it('should return error for 129 characters', () => {
      const text = 'a'.repeat(129);
      const result = validateTask(text);
      expect(result).toBe(ValidationError.TOO_LONG);
    });

    it('should return error for 150 characters', () => {
      const text = 'a'.repeat(150);
      const result = validateTask(text);
      expect(result).toBe(ValidationError.TOO_LONG);
    });

    it('should return error for 200 characters', () => {
      const text = 'a'.repeat(200);
      const result = validateTask(text);
      expect(result).toBe(ValidationError.TOO_LONG);
    });
  });

  describe('valid inputs', () => {
    it('should return null for 1 character', () => {
      const result = validateTask('a');
      expect(result).toBeNull();
    });

    it('should return null for exactly 128 characters', () => {
      const text = 'a'.repeat(128);
      const result = validateTask(text);
      expect(result).toBeNull();
    });

    it('should return null for normal text', () => {
      const result = validateTask('Buy groceries');
      expect(result).toBeNull();
    });

    it('should return null for text with spaces', () => {
      const result = validateTask('This is a valid task with spaces');
      expect(result).toBeNull();
    });

    it('should return null for 127 characters', () => {
      const text = 'a'.repeat(127);
      const result = validateTask(text);
      expect(result).toBeNull();
    });
  });
});
