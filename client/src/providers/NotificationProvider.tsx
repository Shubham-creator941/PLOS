import React, { useEffect, useState } from 'react';
import { useNotificationsStore, type ToastNotification } from '@/stores';

const ToastItem: React.FC<{ notification: ToastNotification; onRemove: (id: string) => void }> = ({ notification, onRemove }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Auto-dismiss logic
    const duration = notification.duration || 5000;
    const timer = setTimeout(() => {
      handleRemove();
    }, duration);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300); // Matches exit animation duration
  };

  return (
    <div
      className={`pointer-events-auto p-4 rounded-md shadow-lg border min-w-[300px] flex justify-between items-start transition-all duration-300 ease-in-out transform ${
        isLeaving ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'
      } ${
        notification.type === 'success' ? 'bg-success-50 border-success-200 text-success-800' :
        notification.type === 'error' ? 'bg-danger-50 border-danger-200 text-danger-800' :
        notification.type === 'warning' ? 'bg-warning-50 border-warning-200 text-warning-800' :
        'bg-surface border-border text-text-primary'
      }`}
    >
      <div>
        <h4 className="font-semibold text-sm">{notification.title}</h4>
        {notification.message && <p className="text-xs mt-1 opacity-90">{notification.message}</p>}
      </div>
      <button
        onClick={handleRemove}
        className="text-current opacity-70 hover:opacity-100 transition-opacity p-1 ml-4"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotificationsStore((state) => state.notifications);
  const removeNotification = useNotificationsStore((state) => state.removeNotification);
  
  // Maximum visible notifications: 3
  const MAX_VISIBLE = 3;
  // Show the oldest up to MAX_VISIBLE
  const visibleNotifications = notifications.slice(0, MAX_VISIBLE);

  return (
    <>
      {children}
      {/* Toast Integration Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {visibleNotifications.map((notif) => (
          <ToastItem key={notif.id} notification={notif} onRemove={removeNotification} />
        ))}
      </div>
    </>
  );
};
