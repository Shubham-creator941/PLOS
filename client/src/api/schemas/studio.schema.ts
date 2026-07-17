import { z } from 'zod';

export const StudioTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
});

export const StudioSessionSchema = z.object({
  task: StudioTaskSchema,
  focusTimeTarget: z.number(),
});

export type StudioSession = z.infer<typeof StudioSessionSchema>;
