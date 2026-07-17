import { z } from 'zod';

export const ReflectionResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  content: z.string(),
  timestamp: z.string(),
});

export type ReflectionResponse = z.infer<typeof ReflectionResponseSchema>;
