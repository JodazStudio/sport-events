/**
 * Manager Roles
 */
export type ManagerRole = 'admin' | 'superadmin';

/**
 * Validates if a role is a valid ManagerRole
 */
export function isValidRole(role: string): role is ManagerRole {
  return ['admin', 'superadmin'].includes(role);
}

/**
 * Basic email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates manager input data
 */
export function validateManagerInput(data: {
  name?: string;
  email?: string;
  role?: string;
}) {
  const errors: Record<string, string> = {};

  if (data.name !== undefined && data.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }

  if (data.email !== undefined && !EMAIL_REGEX.test(data.email)) {
    errors.email = 'El correo electrónico no es válido';
  }

  if (data.role !== undefined && !isValidRole(data.role)) {
    errors.role = 'El rol proporcionado no es válido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
