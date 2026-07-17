import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
}

const getInitialSidebarState = (): boolean => {
  const saved = localStorage.getItem('plos-sidebar-open');
  if (saved !== null) {
    return saved === 'true';
  }
  return window.innerWidth > 768; // Default open on desktop, closed on mobile
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: getInitialSidebarState(),
  toggle: () => set((state) => {
    const newState = !state.isOpen;
    localStorage.setItem('plos-sidebar-open', String(newState));
    return { isOpen: newState };
  }),
  setOpen: (isOpen) => set(() => {
    localStorage.setItem('plos-sidebar-open', String(isOpen));
    return { isOpen };
  }),
}));
