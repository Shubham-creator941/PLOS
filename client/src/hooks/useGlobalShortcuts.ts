import { useEffect } from 'react';
import { useCommandPaletteStore } from '@/stores';
import { useSidebarStore } from '@/stores/sidebar';

export const useGlobalShortcuts = () => {
  const toggleCommandPalette = useCommandPaletteStore((state) => state.toggle);
  const setCommandPaletteOpen = useCommandPaletteStore((state) => state.setOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Only allow Escape to blur or close things even if in input
        if (e.key === 'Escape') {
          target.blur();
          setCommandPaletteOpen(false);
        }
        return;
      }

      // Ctrl + K : Toggle Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }

      // Ctrl + B : Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        useSidebarStore.getState().toggle();
      }

      // / : Focus global search (we map this to open command palette for now)
      if (e.key === '/') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // Escape : Close command palette (and other things if needed)
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }

      // Ctrl + Shift + L : Mock action
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        console.log('[Shortcut] Ctrl+Shift+L triggered');
        // E.g., logout or lock screen mock
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette, setCommandPaletteOpen]);
};
