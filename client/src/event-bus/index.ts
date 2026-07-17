import mitt from 'mitt';
import { useEffect } from 'react';

// Strongly typed events
export type AppEvents = {
  'session:start': { sessionId: string };
  'session:end': { sessionId: string; metrics: any };
  'runtime:nudge': { message: string; type: 'info' | 'warning' | 'success' };
  'assessment:complete': { score: number; passed: boolean };
  'library:update': { resourceId: string; status: string };
};

export const eventBus = mitt<AppEvents>();

// Automatic cleanup hook
export const useEventBus = <Key extends keyof AppEvents>(
  type: Key,
  handler: (event: AppEvents[Key]) => void
) => {
  useEffect(() => {
    eventBus.on(type, handler);
    return () => {
      eventBus.off(type, handler);
    };
  }, [type, handler]);
};
