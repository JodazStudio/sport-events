import { isValidRole, validateManagerInput } from './utils';

describe('Managers Utilities', () => {
  describe('isValidRole', () => {
    test('should return true for admin', () => {
      expect(isValidRole('admin')).toBe(true);
    });

    test('should return true for superadmin', () => {
      expect(isValidRole('superadmin')).toBe(true);
    });

    test('should return false for random string', () => {
      expect(isValidRole('user')).toBe(false);
      expect(isValidRole('')).toBe(false);
    });
  });

  describe('validateManagerInput', () => {
    test('should validate a correct input', () => {
      const input = {
        name: 'Jesus Ordosgoitty',
        email: 'jesus@example.com',
        role: 'admin'
      };
      const result = validateManagerInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('should catch short name', () => {
      const input = { name: 'Je' };
      const result = validateManagerInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    test('should catch invalid email', () => {
      const input = { email: 'invalid-email' };
      const result = validateManagerInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    test('should catch invalid role', () => {
      const input = { role: 'super-user' };
      const result = validateManagerInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.role).toBeDefined();
    });

    test('should allow partial validation', () => {
      const input = { name: 'Jesus' };
      const result = validateManagerInput(input);
      expect(result.isValid).toBe(true);
    });
  });
});
