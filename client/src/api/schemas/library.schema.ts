import { z } from 'zod';

export const LibraryResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['article', 'video', 'flashcard']),
  url: z.string().optional(),
});

export const LibraryResponseSchema = z.object({
  resources: z.array(LibraryResourceSchema),
});

export type LibraryResponse = z.infer<typeof LibraryResponseSchema>;
