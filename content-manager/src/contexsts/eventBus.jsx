import React from 'react';

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
  const listeners = new Map();

  const on = (event, callback) => {
    if (!listeners.has(event)) {
      listeners.set(event, []);
    }
    listeners.get(event).push(callback);
  };

  const off = (event, callback) => {
    if (listeners.has(event)) {
      const eventListeners = listeners.get(event);
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  };

  const emit = (event, payload) => {
    if (listeners.has(event)) {
      listeners.get(event).forEach(callback => callback(payload));
    }
  };

  return (
    <EventBusContext.Provider value={{ on, off, emit }}>
      {children}
    </EventBusContext.Provider>
  );
};