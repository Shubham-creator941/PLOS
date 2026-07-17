import { create } from 'zustand';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number; // Time in ms before auto-dismiss
}

interface NotificationsState {
  notifications: ToastNotification[];
  addNotification: (notification: Omit<ToastNotification, 'id'>) => string;
  removeNotification: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  addNotification: (notification) => {
    const state = get();
    // Duplicate prevention
    const isDuplicate = state.notifications.some(
      (n) => n.title === notification.title && n.message === notification.message
    );
    if (isDuplicate) return '';

    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    return id;
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
