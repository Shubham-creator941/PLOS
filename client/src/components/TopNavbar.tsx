import React from 'react';
import { Bell, Menu, Moon, Sun } from 'lucide-react';
import { Avatar } from './Avatar';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-800 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-title text-neutral-900 md:hidden dark:text-neutral-50">PLOS</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-800">
          <Sun className="h-5 w-5 hidden dark:block" />
          <Moon className="h-5 w-5 block dark:hidden" />
        </button>
        
        <button className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-800">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-neutral-950" />
        </button>

        <Avatar initials="JD" size="sm" className="cursor-pointer" />
      </div>
    </header>
  );
};
