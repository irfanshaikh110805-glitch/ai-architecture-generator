import { describe, it, expect } from 'vitest';
import { validateProjectIdea, sanitizeInput, sanitizeHTML } from '../utils/validation';

describe('Input Validation', () => {
  it('should validate correct project idea', () => {
    const result = validateProjectIdea('A social media platform for pet owners');
    expect(result.success).toBe(true);
    expect(result.data.idea).toBeDefined();
  });

  it('should reject too short input', () => {
    const result = validateProjectIdea('Hi');
    expect(result.success).toBe(false);
    expect(result.error).toContain('at least 10 characters');
  });

  it('should reject too long input', () => {
    const result = validateProjectIdea('a'.repeat(5001));
    expect(result.success).toBe(false);
    expect(result.error).toContain('must not exceed 5000 characters');
  });

  it('should sanitize HTML tags', () => {
    const result = sanitizeHTML('<script>alert("xss")</script>Hello');
    expect(result).not.toContain('<script>');
    expect(result).toContain('Hello');
  });

  it('should sanitize SQL injection attempts', () => {
    const result = sanitizeInput("test'; DROP TABLE users; --");
    expect(result).not.toContain('DROP');
    expect(result).not.toContain('--');
  });

  it('should handle normal text without modification', () => {
    const text = 'Build a normal web application';
    const result = sanitizeInput(text);
    expect(result).toBe(text);
  });
});
