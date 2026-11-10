import { z } from 'zod';

export const CreateServiceRequestSchema = z.object({
  service_id: z.number().int().positive(),
  chat_data: z.record(z.string(), z.unknown()),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  referrer_url: z.string().optional(),
});

export type CreateServiceRequestDto = z.infer<typeof CreateServiceRequestSchema>;

export const SignServiceRequestSchema = z.object({
  signature_data: z.string().nullable().optional(),
  signature_name: z.string().nullable().optional(),
});

export type SignServiceRequestDto = z.infer<typeof SignServiceRequestSchema>;

export const CreateCommentSchema = z.object({
  request_id: z.string().uuid(),
  content: z.string().min(1),
});

export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
