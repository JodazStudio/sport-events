import { registrationStageFormSchema } from './schemas';

describe('registrationStageFormSchema', () => {
  it('should validate a valid stage', () => {
    const validStage = {
      name: 'Early Bird',
      price_usd: 25.50,
      total_capacity: 100,
      is_active: true
    };
    const result = registrationStageFormSchema.safeParse(validStage);
    expect(result.success).toBe(true);
  });

  it('should fail if name is empty', () => {
    const invalidStage = {
      name: '',
      price_usd: 25.50,
      total_capacity: 100,
      is_active: true
    };
    const result = registrationStageFormSchema.safeParse(invalidStage);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es requerido');
    }
  });

  it('should fail if price is negative', () => {
    const invalidStage = {
      name: 'Early Bird',
      price_usd: -10,
      total_capacity: 100,
      is_active: true
    };
    const result = registrationStageFormSchema.safeParse(invalidStage);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El precio no puede ser negativo');
    }
  });

  it('should fail if capacity is less than 1', () => {
    const invalidStage = {
      name: 'Early Bird',
      price_usd: 25.50,
      total_capacity: 0,
      is_active: true
    };
    const result = registrationStageFormSchema.safeParse(invalidStage);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La capacidad debe ser al menos 1');
    }
  });

  it('should coerce string values to numbers', () => {
    const stageWithStrings = {
      name: 'Early Bird',
      price_usd: '25.50',
      total_capacity: '100',
      is_active: true
    };
    const result = registrationStageFormSchema.safeParse(stageWithStrings);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price_usd).toBe(25.50);
      expect(result.data.total_capacity).toBe(100);
    }
  });
});
