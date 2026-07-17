import { z } from 'zod';

export const MissionSchema = z.object({
  title: z.string(),
  estimatedTime: z.string(),
  difficulty: z.string(),
  focusReady: z.boolean(),
});

export const MomentumSchema = z.object({
  currentStreak: z.number(),
  weeklyCompletion: z.number(),
  weeklyTotal: z.number(),
});

export const DashboardResponseSchema = z.object({
  hero: z.object({
    currentGoal: z.string(),
  }),
  mission: MissionSchema,
  intelligence: z.object({
    messages: z.array(z.string()),
  }),
  momentum: MomentumSchema,
});

export type DashboardResponse = z.infer<typeof DashboardResponseSchema>;
