import { z } from 'zod';

export const aiGenerateSchema = z.object({
  prompt: z.string().min(1),
  context: z.record(z.unknown()).optional(),
  language: z.enum(['es', 'en', 'fr', 'pt']).default('es'),
  conversationId: z.string().optional(),
  memory: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().min(1),
      }),
    )
    .max(20)
    .optional(),
});
