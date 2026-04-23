import { z } from 'zod';

export const BillingStageSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  event_id: z.string().uuid(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  service_fee: z.number().default(0),
  total_capacity: z.number().nullable(),
  used_capacity: z.number().default(0),
  is_active: z.boolean().default(true),
  is_settled: z.boolean().default(false),
  settled_at: z.string().nullable(),
  created_at: z.string(),
  gross_revenue_ves: z.number().default(0),
  approved_count: z.number().default(0),
  platform_commission_usd: z.number().default(0),
  events: z.object({
    name: z.string(),
    slug: z.string(),
    manager_id: z.string().uuid(),
    managers: z.object({
      name: z.string().nullable(),
      email: z.string().nullable(),
    }).nullable(),
  }).nullable(),
});

export type BillingStage = z.infer<typeof BillingStageSchema>;

export const BillingDataSchema = z.array(BillingStageSchema);
