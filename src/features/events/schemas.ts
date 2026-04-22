import * as z from 'zod';

/**
 * Schema for individual event registration stages
 */
export const registrationStageSchema = z.object({
  id: z.string(),
  event_id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  price_usd: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  total_capacity: z.coerce.number().min(1, 'La capacidad debe ser al menos 1'),
  used_capacity: z.number().default(0),
  is_active: z.boolean().default(false),
  created_at: z.string().optional(),
});

/**
 * Form Schema for creating/editing stages
 */
export const registrationStageFormSchema = registrationStageSchema.omit({ 
  id: true, 
  event_id: true, 
  used_capacity: true, 
  created_at: true 
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
  event_date: z.string().optional().nullable(),
  event_time: z.string().optional().nullable(),
  rules_text: z.string().optional().nullable(),
  has_inventory: z.boolean().default(false),
  banner_url: z.string().optional().nullable(),
  route_image_url: z.string().optional().nullable(),
  strava_url: z.string().optional().nullable(),
  social_media: z.record(z.string(), z.any()).optional().nullable(),
  payment_info: z.object({
    bank_name: z.string(),
    account_number: z.string(),
    id_number: z.string(),
    phone_number: z.string(),
  }).optional().nullable(),
  manager_id: z.string().optional(),
  created_at: z.string().optional(),
  categories: z.lazy(() => z.array(categorySchema)).optional(),
  registration_stages: z.lazy(() => z.array(registrationStageSchema)).optional(),
});

/**
 * Schema for payment data in registration
 */
export const paymentDataSchema = z.object({
  amount_usd: z.number().min(0),
  exchange_rate_bcv: z.number().min(0),
  amount_ves: z.number().min(0),
  reference_number: z.string().min(1, 'Referencia requerida'),
  receipt_url: z.string().url('URL de comprobante inválida'),
}).nullable();

/**
 * Schema for Athlete Registration
 */
export const registrationSchema = z.object({
  id: z.string().optional(),
  event_id: z.string().uuid(),
  stage_id: z.string().uuid(),
  category_id: z.string().uuid().optional(),
  first_name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().min(1, 'El apellido es requerido'),
  dni: z.string().min(1, 'La cédula/pasaporte es requerida'),
  email: z.string().email('El correo electrónico es inválido'),
  birth_date: z.string().min(1, 'La fecha de nacimiento es requerida'),
  gender: z.enum(['MALE', 'FEMALE']),
  shirt_size: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'REPORTED', 'APPROVED', 'REJECTED', 'EXPIRED']).optional(),
  payment_data: paymentDataSchema.optional(),
});

/**
 * Schema for API list response
 */
export const eventListSchema = z.lazy(() => z.array(eventSchema));

/**
 * API Response wrappers
 */
export const eventListResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  data: z.lazy(() => eventListSchema).optional(),
  message: z.string().optional(),
  details: z.string().optional(),
});

export const singleEventResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  data: z.lazy(() => eventSchema).optional(),
  message: z.string().optional(),
  details: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;
export type Category = z.infer<typeof categorySchema>;
export type RegistrationStage = z.infer<typeof registrationStageSchema>;
export type Registration = z.infer<typeof registrationSchema>;
