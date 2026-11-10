import { z } from 'zod';

/** Estados de um pedido de serviço, do orçamento à entrega. */
export const ServiceRequestStatusSchema = z.enum([
  'collecting',
  'pending_quote',
  'awaiting_signature',
  'awaiting_payment',
  'in_progress',
  'completed',
  'cancelled',
]);
export type ServiceRequestStatus = z.infer<typeof ServiceRequestStatusSchema>;

/** Estados de uma assinatura de ferramenta, vindos do gateway ou do admin. */
export const SaasSubscriptionStatusSchema = z.enum(['pending', 'active', 'cancelled', 'suspended', 'expired', 'failed']);
export type SaasSubscriptionStatus = z.infer<typeof SaasSubscriptionStatusSchema>;
