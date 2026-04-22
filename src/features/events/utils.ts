/**
 * Utility function to check if a new age range overlaps with existing ranges
 * for the same sex in a specific event.
 */
export interface AgeRange {
  id?: string;
  gender: string;
  min_age: number;
  max_age: number;
}

/**
 * Returns true if there is an overlap, false otherwise.
 */
export function checkAgeOverlap(newCategory: AgeRange, existingCategories: AgeRange[]): boolean {
  return existingCategories.some((existing) => {
    // If it's the same category (editing), skip
    if (newCategory.id && existing.id === newCategory.id) return false;
    
    // Only check overlap for the same gender
    // Note: 'Mixto' overlaps with both 'Masculino' and 'Femenino'? 
    // Usually 'Mixto' is a separate category, but logically we check exact gender match.
    if (existing.gender !== newCategory.gender) return false;

    // Overlap formula: (start1 <= end2) AND (end1 >= start2)
    const isOverlapping = 
      newCategory.min_age <= existing.max_age && 
      newCategory.max_age >= existing.min_age;
    
    return isOverlapping;
  });
}
