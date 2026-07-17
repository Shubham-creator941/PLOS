import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QueuedMutation {
  id: string;
  mutationKey: unknown[];
  variables: unknown;
  timestamp: number;
}

interface MutationQueueState {
  queue: QueuedMutation[];
  enqueue: (mutation: Omit<QueuedMutation, 'id' | 'timestamp'>) => void;
  dequeue: (id: string) => void;
  clearQueue: () => void;
}

// Placeholder for Sprint 6 offline replay
export const useMutationQueue = create<MutationQueueState>()(
  persist(
    (set) => ({
      queue: [],
      enqueue: (mutation) =>
        set((state) => ({
          queue: [
            ...state.queue,
            { ...mutation, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),
      dequeue: (id) =>
        set((state) => ({
          queue: state.queue.filter((m) => m.id !== id),
        })),
      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: 'mutation-queue-storage',
    }
  )
);
