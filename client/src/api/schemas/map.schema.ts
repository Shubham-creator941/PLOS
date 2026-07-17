import { z } from 'zod';

export const MilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['completed', 'in-progress', 'locked']),
});

export const MapResponseSchema = z.object({
  milestones: z.array(MilestoneSchema),
  currentPhase: z.string(),
});

export type MapResponse = z.infer<typeof MapResponseSchema>;
