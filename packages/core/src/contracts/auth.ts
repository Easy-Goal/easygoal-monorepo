import { z } from 'zod';

export const CompleteProfileSchema = z
  .object({
    has_company: z.boolean(),
    beta_accepted: z.literal(true, {
      errorMap: () => ({ message: 'Aceite do Termo Beta é obrigatório para continuar.' }),
    }),
    name_company: z.string().min(2).optional(),
    cnpj_company: z.string().min(14).max(18).optional(),
    cpf: z.string().min(11).max(14).optional(),
    phone: z.string().optional(),
  })
  .refine((d) => !d.has_company || (!!d.name_company && !!d.cnpj_company), {
    message: 'Nome da empresa e CNPJ são obrigatórios para pessoa jurídica.',
  })
  .refine((d) => d.has_company || !!d.cpf, {
    message: 'CPF é obrigatório para pessoa física.',
  });

export type CompleteProfileDto = z.infer<typeof CompleteProfileSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  name_company: z.string().min(2),
  cnpj_company: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  // Opcional desde o ADR 072: o cadastro não escolhe plano.
  plan_slug: z.string().min(1).optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  new_password: z.string().min(6),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;

export const SessionExchangeSchema = z.object({
  access_token: z.string().min(1),
});

export type SessionExchangeDto = z.infer<typeof SessionExchangeSchema>;

export const VerifyTokenSchema = z.object({
  token: z.string().min(1),
});

export type VerifyTokenDto = z.infer<typeof VerifyTokenSchema>;

export const TokenRequestSchema = z.discriminatedUnion('grant_type', [
  z.object({
    grant_type: z.literal('client_credentials'),
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
  }),
  z.object({
    grant_type: z.literal('password'),
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
    username: z.string().email({ message: 'username deve ser um e-mail válido' }),
    password: z.string().min(1),
  }),
  z.object({
    grant_type: z.literal('refresh_token'),
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
    refresh_token: z.string().min(1),
  }),
]);

export type TokenRequestDto = z.infer<typeof TokenRequestSchema>;
