import * as z from 'zod';

/**
 * Schema for individual event registration stages
 */
export const registrationStageSchema = z.object({
  id: z.string(),
  name: z.string(),
  price_usd: z.number(),
  total_capacity: z.number().nullable().optional(),
  used_capacity: z.number().nullable().optional(),
  is_active: z.boolean().default(false),
});

/**
 * Schema for event categories
 */
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'MIXED']),
  min_age: z.number().min(0, 'La edad mínima no puede ser negativa'),
  max_age: z.number().min(0, 'La edad máxima no puede ser negativa'),
});

/**
 * Main Event Schema
 */
export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  event_date: z.string(),
  event_time: z.string(),
  rules_text: z.string().optional().nullable(),
  has_inventory: z.boolean().default(false),
  banner_url: z.string().optional().nullable(),
  route_image_url: z.string().optional().nullable(),
  strava_url: z.string().optional().nullable(),
  manager_id: z.string().optional(),
  created_at: z.string().optional(),
  categories: z.array(categorySchema).optional(),
  registration_stages: z.array(registrationStageSchema).optional(),
});

/**
 * Schema for API list response
 */
export const eventListSchema = z.array(eventSchema);

/**
 * API Response wrappers
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => 
  z.object({
    status: z.enum(['success', 'error']),
    data: dataSchema.optional(),
    message: z.string().optional(),
    details: z.string().optional(),
  });

export const eventListResponseSchema = apiResponseSchema(eventListSchema);
export const singleEventResponseSchema = apiResponseSchema(eventSchema);

export type Event = z.infer<typeof eventSchema>;
export type Category = z.infer<typeof categorySchema>;
export type RegistrationStage = z.infer<typeof registrationStageSchema>;
