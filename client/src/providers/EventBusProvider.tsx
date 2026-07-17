import React, { createContext, useContext } from 'react';
import { eventBus, type AppEvents } from '../event-bus';
import type { Emitter } from 'mitt';

const EventBusContext = createContext<Emitter<AppEvents> | null>(null);

export const EventBusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EventBusContext.Provider value={eventBus}>
      {children}
    </EventBusContext.Provider>
  );
};

export const useEventBusContext = () => {
  const context = useContext(EventBusContext);
  if (!context) {
    throw new Error('useEventBusContext must be used within an EventBusProvider');
  }
  return context;
};
