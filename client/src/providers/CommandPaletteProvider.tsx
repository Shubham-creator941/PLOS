import React, { useState, useEffect, useRef } from 'react';
import { useCommandPaletteStore } from '@/stores';

interface Action {
  id: string;
  label: string;
  path?: string;
  action?: () => void;
  section: string;
}

const MOCK_ACTIONS: Action[] = [
  { id: '1', label: 'Go to Dashboard', path: '/dashboard', section: 'Navigation' },
  { id: '2', label: 'Go to Library', path: '/library', section: 'Navigation' },
  { id: '3', label: 'Start Focus Session', action: () => console.log('Starting session...'), section: 'Quick Actions' },
  { id: '4', label: 'New Reflection', path: '/reflection', section: 'Quick Actions' },
  { id: '5', label: 'View Map', path: '/journey', section: 'Navigation' },
];

export const CommandPaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isOpen = useCommandPaletteStore((state) => state.isOpen);
  const setOpen = useCommandPaletteStore((state) => state.setOpen);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredActions = MOCK_ACTIONS.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const action = filteredActions[selectedIndex];
      if (action) {
        handleAction(action);
      }
    }
  };

  const handleAction = (action: Action) => {
    setOpen(false);
    if (action.action) {
      action.action();
    } else if (action.path) {
      // Because we are outside RouterProvider, use standard location manipulation
      window.location.href = action.path;
    }
  };

  return (
    <>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl bg-surface rounded-xl shadow-2xl border border-border overflow-hidden animate-[fade-in_0.15s_ease-out]">
            <div className="p-4 border-b border-border flex items-center">
              <span className="text-text-muted mr-3">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search commands... (e.g., 'Go to Dashboard')"
                className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-muted text-lg"
              />
            </div>
            <div className="p-2 min-h-[300px] max-h-[500px] overflow-y-auto">
              {filteredActions.length === 0 ? (
                <div className="p-4 text-center text-text-muted">No commands found.</div>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex justify-between items-center ${
                        selectedIndex === index ? 'bg-primary-50 text-primary-900' : 'text-text-secondary hover:bg-surface-active'
                      }`}
                    >
                      <span>{action.label}</span>
                      <span className="text-xs text-text-muted px-2 py-1 bg-background rounded-md">{action.section}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
