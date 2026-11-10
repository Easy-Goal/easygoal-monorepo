import { z } from 'zod';

const VALID_REASONS = [
  'too_expensive',
  'no_longer_needed',
  'found_alternative',
  'technical_issues',
  'poor_support',
  'other',
] as const;

export const CancelSubscriptionSchema = z.object({
  subscription_id: z.string().uuid(),
  reason: z.enum(VALID_REASONS, { message: 'Motivo inválido' }),
  feedback: z.string().optional(),
});

export type CancelSubscriptionDto = z.infer<typeof CancelSubscriptionSchema>;

export const CreateFeedbackSchema = z.object({
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  visibility: z.enum(['public', 'producer_only']).default('public'),
});

export type CreateFeedbackDto = z.infer<typeof CreateFeedbackSchema>;

export const InviteProducerSchema = z.object({
  email: z.string().email(),
  equity_percent: z.number().positive(),
  analytics_access: z.enum(['full', 'financial_only']).default('full'),
  google_email: z.string().optional().nullable(),
});

export type InviteProducerDto = z.infer<typeof InviteProducerSchema>;
