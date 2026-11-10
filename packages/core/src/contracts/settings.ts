import { z } from 'zod';

export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  cnpj: z.string().min(1),
});

export type CreateCompanyDto = z.infer<typeof CreateCompanySchema>;

export const UpdateCompanySchema = z.object({
  name: z.string().min(1),
  cnpj: z.string().optional().nullable(),
  invite_from_name: z.string().max(100).optional().nullable(),
  invite_from_email: z.string().email().optional().nullable(),
});

export type UpdateCompanyDto = z.infer<typeof UpdateCompanySchema>;

export const SwitchCompanySchema = z.object({
  company_id: z.string().uuid(),
});

export type SwitchCompanyDto = z.infer<typeof SwitchCompanySchema>;

export const UpdateAccountSchema = z.object({
  name: z.string().optional(),
  phone_number: z.string().nullable().optional(),
});

export type UpdateAccountDto = z.infer<typeof UpdateAccountSchema>;

export const UpdateEmailSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(1),
});

export type UpdateEmailDto = z.infer<typeof UpdateEmailSchema>;

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;

export const UpdatePaymentSettingsSchema = z.object({
  abacatepay_email: z.string().email().optional(),
  pix_key: z.string().optional(),
  pix_key_type: z.string().optional(),
});

export type UpdatePaymentSettingsDto = z.infer<typeof UpdatePaymentSettingsSchema>;
