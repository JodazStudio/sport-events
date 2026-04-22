import { checkAgeOverlap, AgeRange } from './utils';

describe('checkAgeOverlap', () => {
  const existingCategories: AgeRange[] = [
    { id: '1', gender: 'Masculino', min_age: 18, max_age: 30 },
    { id: '2', gender: 'Masculino', min_age: 40, max_age: 50 },
    { id: '3', gender: 'Femenino', min_age: 18, max_age: 35 },
  ];

  test('should return true for overlapping range in same gender', () => {
    const newCategory: AgeRange = { gender: 'Masculino', min_age: 25, max_age: 35 };
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(true);
  });

  test('should return false for non-overlapping range in same gender', () => {
    const newCategory: AgeRange = { gender: 'Masculino', min_age: 31, max_age: 39 };
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(false);
  });

  test('should return false for same range in different gender', () => {
    const newCategory: AgeRange = { gender: 'Femenino', min_age: 40, max_age: 50 };
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(false);
  });

  test('should return true for exact overlap (same values)', () => {
    const newCategory: AgeRange = { gender: 'Masculino', min_age: 18, max_age: 30 };
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(true);
  });

  test('should return true for a range that completely contains an existing range', () => {
    const newCategory: AgeRange = { gender: 'Masculino', min_age: 10, max_age: 60 };
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(true);
  });

  test('should return true for a range that is completely contained in an existing range', () => {
    const newCategory: AgeRange = { gender: 'Masculino', min_age: 20, max_age: 25 };
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(true);
  });

  test('should return false when editing a category and not overlapping with others', () => {
    const newCategory: AgeRange = { id: '1', gender: 'Masculino', min_age: 18, max_age: 35 };
    // Should skip check against itself (id: '1') and not overlap with id: '2' (40-50)
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(false);
  });

  test('should return true if editing a category causes overlap with another existing category', () => {
    const newCategory: AgeRange = { id: '1', gender: 'Masculino', min_age: 35, max_age: 45 };
    // Overlaps with id: '2' (40-50)
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(true);
  });

  test('should return true for boundary overlap (min equals existing max)', () => {
    const newCategory: AgeRange = { gender: 'Masculino', min_age: 30, max_age: 35 };
    expect(checkAgeOverlap(newCategory, existingCategories)).toBe(true);
  });
});
