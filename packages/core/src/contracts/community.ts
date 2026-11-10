import { z } from 'zod';

export const SuggestItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export type SuggestItemDto = z.infer<typeof SuggestItemSchema>;

export const VoteItemSchema = z.object({
  item_id: z.string().uuid(),
  vote: z.union([z.literal(1), z.literal(-1)]),
});

export type VoteItemDto = z.infer<typeof VoteItemSchema>;

export const DeleteVoteSchema = z.object({
  item_id: z.string().uuid(),
});

export type DeleteVoteDto = z.infer<typeof DeleteVoteSchema>;

export const TourProgressSchema = z.object({
  last_step: z.number().int().min(0).default(0),
});
export type TourProgressDto = z.infer<typeof TourProgressSchema>;
